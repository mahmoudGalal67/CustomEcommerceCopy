<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Str;

class KnowledgeBaseService
{
    private string $qdrantUrl;

    private string $collectionName;

    private int $vectorSize = 768;

    public function __construct()
    {
        $this->qdrantUrl = rtrim(
            env('QDRANT_URL', 'http://localhost:6333'),
            '/'
        );

        $this->collectionName = env(
            'QDRANT_COLLECTION',
            'products_knowledge'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Ollama Embedding
    |--------------------------------------------------------------------------
    */

    // public function getEmbedding(string $text): array
    // {
    //     $response = Http::timeout(60)
    //         ->post(
    //             rtrim(
    //                 env('OLLAMA_URL', 'http://localhost:11434'),
    //                 '/'
    //             ) . '/api/embeddings',
    //             [
    //                 'model' => env(
    //                     'OLLAMA_EMBEDDING_MODEL',
    //                     'nomic-embed-text'
    //                 ),
    //                 'prompt' => $text,
    //             ]
    //         )
    //         ->throw();

    //     $embedding = $response->json('embedding');

    //     if (!is_array($embedding)) {
    //         throw new \Exception(
    //             'Ollama did not return a valid embedding.'
    //         );
    //     }

    //     if (count($embedding) !== $this->vectorSize) {
    //         throw new \Exception(
    //             "Invalid embedding size. Expected {$this->vectorSize}, got "
    //                 . count($embedding)
    //         );
    //     }

    //     return $embedding;
    // }

    public function getEmbedding(string $text): array
{
    $apiKey = config('services.gemini.api_key');

    $model = config(
        'services.gemini.embedding_model',
        'gemini-embedding-2'
    );

    $dimensions = config(
        'services.gemini.embedding_dimensions',
        768
    );

    if (!$apiKey) {
        throw new \RuntimeException(
            'Gemini API key is not configured.'
        );
    }

    $response = Http::timeout(60)
        ->withHeaders([
            'x-goog-api-key' => $apiKey,
            'Content-Type' => 'application/json',
        ])
        ->post(
            "https://generativelanguage.googleapis.com/v1beta/models/{$model}:embedContent",
            [
                'content' => [
                    'parts' => [
                        [
                            'text' => $text,
                        ],
                    ],
                ],

                'output_dimensionality' => $dimensions,
            ]
        )
        ->throw();

    $embedding = $response->json(
        'embedding.values'
    );

    if (!is_array($embedding)) {
        throw new \RuntimeException(
            'Gemini did not return a valid embedding.'
        );
    }

    if (count($embedding) !== $this->vectorSize) {
        throw new \RuntimeException(
            "Invalid embedding size. Expected {$this->vectorSize}, got "
            . count($embedding)
        );
    }

    return $embedding;
}
    /*
    |--------------------------------------------------------------------------
    | Qdrant Collection
    |--------------------------------------------------------------------------
    */

    public function ensureCollection(): void
    {
        $url = "{$this->qdrantUrl}/collections/{$this->collectionName}";

        $response = Http::get($url);

        if ($response->successful()) {
            return;
        }

        Http::put($url, [
            'vectors' => [
                'size' => $this->vectorSize,
                'distance' => 'Cosine',
            ],
        ])->throw();
    }

    /*
    |--------------------------------------------------------------------------
    | Build Searchable Product Document
    |--------------------------------------------------------------------------
    */

    public function buildProductDocument(Product $product): string
    {
        $product->loadMissing([
            'translations',
            'categories.translations',
            'variants.color',
            'variants.size',
        ]);

        $document = '';

        /*
        |--------------------------------------------------------------
        | Product translations
        |--------------------------------------------------------------
        */

        foreach ($product->translations as $translation) {

            $document .= "Language: {$translation->locale}\n";

            $document .= "Product name: {$translation->name}\n";

            if ($translation->description) {
                $document .=
                    "Description: {$translation->description}\n";
            }

            $document .= "\n";
        }

        /*
        |--------------------------------------------------------------
        | Categories + translations
        |--------------------------------------------------------------
        */

        $document .= "Categories:\n";

        foreach ($product->categories as $category) {

            foreach ($category->translations as $translation) {

                $document .=
                    "- {$translation->locale}: {$translation->name}\n";
            }
        }

        /*
        |--------------------------------------------------------------
        | Product without variants
        |--------------------------------------------------------------
        */

        $activeVariants = $product->variants
            ->where('is_active', true);

        if ($activeVariants->isEmpty()) {

            $document .= "\n";

            $document .=
                "Price: {$product->base_price}\n";

            $document .=
                "This product has no variants.\n";
        }

        /*
        |--------------------------------------------------------------
        | Product variants
        |--------------------------------------------------------------
        */

        if ($activeVariants->isNotEmpty()) {

            $document .= "\nAvailable variants:\n";

            foreach ($activeVariants as $variant) {

                $color = $variant->color?->name ?? '';

                $size = $variant->size?->name ?? '';

                $document .=
                    "Color: {$color}";

                if ($size) {
                    $document .=
                        ", Size: {$size}";
                }

                $document .=
                    ", Price: {$variant->price}";

                 $document .=
                    ", Stock: {$variant->stock}";

                $document .= "\n";
            }
        }

        return trim($document);
    }

    /*
    |--------------------------------------------------------------------------
    | Index Product
    |--------------------------------------------------------------------------
    */

    public function indexProduct(Product $product): void
    {
        $this->ensureCollection();

        $document = $this->buildProductDocument($product);

        if (empty($document)) {
            return;
        }

        $embedding = $this->getEmbedding($document);

        Http::put(
            "{$this->qdrantUrl}/collections/{$this->collectionName}/points",
            [
                'points' => [
                    [
                        'id' => $product->id,

                        'vector' => $embedding,

                        'payload' => [
                            'source_type' => 'product',

                            'product_id' => $product->id,

                            'seller_id' => $product->seller_id,

                            'content' => $document,
                        ],
                    ],
                ],
            ]
        )->throw();
    }

    public function indexAllProducts(): array
{
    $this->ensureCollection();

    $products = Product::query()->get();

    $indexed = [];
    $skipped = [];

    foreach ($products as $product) {
        // Check whether this product is already indexed in Qdrant
        $response = Http::post(
            "{$this->qdrantUrl}/collections/{$this->collectionName}/points",
            [
                'ids' => [$product->id],
                'with_payload' => false,
                'with_vector' => false,
            ]
        )->throw();

        $points = $response->json('result', []);

        // Qdrant returns existing points here
        if (!empty($points)) {
            $skipped[] = $product->id;
            continue;
        }

        // Index only products that don't exist
        $this->indexProduct($product);

        $indexed[] = $product->id;
    }

    return [
        'total_products' => $products->count(),
        'indexed' => count($indexed),
        'skipped' => count($skipped),
        'indexed_product_ids' => $indexed,
        'skipped_product_ids' => $skipped,
    ];
}
    /*
    |--------------------------------------------------------------------------
    | Delete Product
    |--------------------------------------------------------------------------
    */

    public function deleteProduct(int $productId): void
    {
          $this->ensureCollection();
        Http::delete(
            "{$this->qdrantUrl}/collections/{$this->collectionName}/points",
            [
                'points' => [$productId],
            ]
        )->throw();
    }

    /*
    |--------------------------------------------------------------------------
    | Search Qdrant
    |--------------------------------------------------------------------------
    */

    public function searchVectors(
        string $question,
        int $limit = 5
    ): array {
        $this->ensureCollection();

        $embedding = $this->getEmbedding($question);

        $response = Http::post(
            "{$this->qdrantUrl}/collections/{$this->collectionName}/points/query",
            [
                'query' => $embedding,

                'limit' => $limit,

                'with_payload' => true,

                'with_vector' => false,
            ]
        )->throw();

        return $response->json('result.points', []);
    }

    /*
    |--------------------------------------------------------------------------
    | Get Product IDs
    |--------------------------------------------------------------------------
    */

    public function getProductIds(array $results): array
    {
        return collect($results)
            ->map(
                fn($result) =>
                $result['payload']['product_id'] ?? null
            )
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /*
    |--------------------------------------------------------------------------
    | Get Fresh Products From MySQL
    |--------------------------------------------------------------------------
    */

    public function getProducts(
        array $productIds
    ): Collection {

        if (empty($productIds)) {
            return collect();
        }

        $products = Product::with([
            'translations',

            'categories.translations',

            'variants' => function ($query) {
                $query->where('is_active', true);
            },

            'variants.color',

            'variants.size',
        ])
            ->whereIn('id', $productIds)

            ->where('is_active', true)

            ->get();

        /*
        | Preserve Qdrant relevance order
        */

        return $products
            ->sortBy(
                fn($product) =>
                array_search(
                    $product->id,
                    $productIds
                )
            )
            ->values();
    }

    /*
    |--------------------------------------------------------------------------
    | Build Fresh AI Context
    |--------------------------------------------------------------------------
    */

    public function buildProductContext(
        Collection $products
    ): string {

        return $products
            ->map(function (Product $product) {

                $context = '';

                /*
                | Product names and descriptions
                */

                foreach ($product->translations as $translation) {

                    $context .=
                        "Language: {$translation->locale}\n";

                    $context .=
                        "Product: {$translation->name}\n";

                    if ($translation->description) {

                        $context .=
                            "Description: {$translation->description}\n";
                    }

                    $context .= "\n";
                }

                /*
                | Categories
                */

                $categoryNames = [];

                foreach ($product->categories as $category) {

                    foreach ($category->translations as $translation) {

                        $categoryNames[] =
                            $translation->name;
                    }
                }

                if (!empty($categoryNames)) {

                    $context .=
                        "Categories: "
                        . implode(
                            ', ',
                            array_unique($categoryNames)
                        )
                        . "\n\n";
                }

                /*
                | Active variants
                */

                $variants = $product->variants
                    ->where('is_active', true);

                /*
                | No variants → use base product price
                */

                if ($variants->isEmpty()) {

                    $context .=
                        "Price: {$product->base_price}\n";

                    $context .=
                        "Variants: None\n";
                }

                /*
                | Has variants
                */

                if ($variants->isNotEmpty()) {

                    $context .=
                        "Available variants:\n";

                    foreach ($variants as $variant) {

                        $color =
                            $variant->color?->name ?? 'N/A';

                        $size =
                            $variant->size?->name ?? 'N/A';

                        $context .=
                            "- Color: {$color}"
                            . " | Size: {$size}"
                            . " | Price: {$variant->price}"
                            . " | Stock: {$variant->stock}"
                            . "\n";
                    }
                }

                return trim($context);
            })
            ->implode(
                "\n\n====================\n\n"
            );
    }

    public function separateResults(
        array $results
    ): array {

        $products = [];

        $company = [];

        foreach ($results as $result) {

            $payload =
                $result['payload'] ?? [];

            $sourceType =
                $payload['source_type']
                ?? null;

            if (
                $sourceType === 'product'
                && isset($payload['product_id'])
            ) {

                $products[] =
                    $payload['product_id'];
            }

            if (
                $sourceType === 'company'
                && isset($payload['content'])
            ) {

                $company[] =
                    $payload['content'];
            }
        }

        return [

            'product_ids' =>
            array_values(
                array_unique($products)
            ),

            'company_context' =>
            array_values(
                array_unique($company)
            ),
        ];
    }


    /*
|----------------------------------------------------------------------
| Index Company PDF
|----------------------------------------------------------------------
*/

    public function indexCompanyPdf(
        string $pdfPath
    ): void {

        $this->ensureCollection();

        $parser = new Parser();

        $pdf = $parser->parseFile($pdfPath);

        $text = $pdf->getText();

        if (empty(trim($text))) {
            throw new \Exception(
                'Could not extract text from PDF.'
            );
        }

        $chunks = $this->splitText($text);

        $points = [];

        foreach ($chunks as $index => $chunk) {

            $embedding = $this->getEmbedding(
                $chunk
            );

            $points[] = [

                /*
            |----------------------------------------------------------
            | IMPORTANT
            |
            | Product IDs are integers.
            |
            | To avoid conflicts, company documents should use UUIDs.
            |----------------------------------------------------------
            */

                'id' => Str::uuid()->toString(),

                'vector' => $embedding,

                'payload' => [

                    'source_type' => 'company',

                    'document_type' => 'company_information',

                    'chunk_index' => $index,

                    'content' => $chunk,
                ],
            ];
        }

        if (empty($points)) {
            return;
        }

        Http::put(
            "{$this->qdrantUrl}/collections/{$this->collectionName}/points",
            [
                'points' => $points,
            ]
        )->throw();
    }

    /*
|----------------------------------------------------------------------
| Split Text Into Chunks
|----------------------------------------------------------------------
*/

    public function splitText(
        string $text,
        int $chunkSize = 1000,
        int $overlap = 200
    ): array {

        $text = preg_replace(
            '/\s+/',
            ' ',
            trim($text)
        );

        $chunks = [];

        $length = strlen($text);

        $start = 0;

        while ($start < $length) {

            $chunk = substr(
                $text,
                $start,
                $chunkSize
            );

            if (!empty(trim($chunk))) {

                $chunks[] = trim($chunk);
            }

            $start += (
                $chunkSize - $overlap
            );
        }

        return $chunks;
    }

    /*
    |--------------------------------------------------------------------------
    | Complete RAG Search
    |--------------------------------------------------------------------------
    */

    public function searchKnowledge(
        string $question,
        int $limit = 5
    ): array {

        $results = $this->searchVectors(
            $question,
            $limit
        );

        $separated = $this->separateResults(
            $results
        );

        /*
    |--------------------------------------------------------------
    | Get fresh product data from MySQL
    |--------------------------------------------------------------
    */

        $products = $this->getProducts(
            $separated['product_ids']
        );

        $productContext =
            $this->buildProductContext(
                $products
            );

        /*
    |--------------------------------------------------------------
    | Company PDF context
    |--------------------------------------------------------------
    */

        $companyContext =
            implode(
                "\n\n---\n\n",
                $separated['company_context']
            );

        return [

            'products' => $products,

            'product_context' =>
            $productContext,

            'company_context' =>
            $companyContext,
        ];
    }
}
