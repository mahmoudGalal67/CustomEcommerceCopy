<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Product;
use App\Models\Product_translations;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Variant;
use App\Models\VariantImage;
use Illuminate\Support\Facades\Storage;
use Mockery\Undefined;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $request)
{
    $query = Product::query()->with([
        'categories.translations',
        'translations',
        'variants.images',
        'variants.color',
        'variants.size'
    ]);

    /*
    |--------------------------------------------------------------------------
    | Product Search - English + Arabic
    |--------------------------------------------------------------------------
    */
    if ($request->filled('search')) {

        $search = trim($request->search);

        $query->where(function ($q) use ($search) {

            // Search product translations in both languages
            $q->whereHas('translations', function ($t) use ($search) {

                $t->whereIn('locale', ['en', 'ar'])
                    ->where(function ($tt) use ($search) {

                        $tt->where('name', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
            })

            // Search product ID
            ->orWhere('id', 'like', "%{$search}%")

            // Search categories in both languages
            ->orWhereHas('categories.translations', function ($t) use ($search) {

                $t->whereIn('locale', ['en', 'ar'])
                    ->where('name', 'like', "%{$search}%");
            });
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Category Filter - English + Arabic
    |--------------------------------------------------------------------------
    */
    if (
        $request->filled('category') &&
        $request->category !== 'all' &&
        $request->category !== 'undefined'
    ) {

        $category = trim($request->category);

        $query->whereHas('categories.translations', function ($q) use ($category) {

            $q->whereIn('locale', ['en', 'ar'])
                ->where('name', $category);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Price Range Filter
    |--------------------------------------------------------------------------
    */
    if ($request->filled('min_price') && $request->filled('max_price')) {

        $min = $request->min_price;
        $max = $request->max_price;

        $query->where(function ($q) use ($min, $max) {

            // Base product price
            $q->whereBetween('base_price', [$min, $max])

                // Or one of its variants
                ->orWhereHas('variants', function ($sub) use ($min, $max) {

                    $sub->whereBetween('price', [$min, $max]);
                });
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Size Filter
    |--------------------------------------------------------------------------
    */
    if ($request->filled('size')) {

        $query->whereHas('variants', function ($q) use ($request) {

            $q->where('size', $request->size);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Color Filter
    |--------------------------------------------------------------------------
    */
    if ($request->filled('color')) {

        $query->whereHas('variants', function ($q) use ($request) {

            $q->where('color', $request->color);
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */
    if ($request->filled('sort')) {

        $sort = $request->get('sort');

        switch ($sort) {

            case 'oldest':

                $query->orderBy('created_at', 'asc');

                break;

            case 'newest':

                $query->orderBy('created_at', 'desc');

                break;

            case 'asc':
            case 'desc':

                $direction = $sort;

                $query
                    ->select('products.*')
                    ->selectRaw("
                        COALESCE(
                            (
                                SELECT MIN(price)
                                FROM variants
                                WHERE variants.product_id = products.id
                            ),
                            products.base_price
                        ) as effective_price
                    ")
                    ->orderBy('effective_price', $direction);

                break;
        }

    } else {

        $query->latest();
    }

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */
    $limit = $request->get('limit', 20);

    return response()->json(
        $query->paginate($limit)
    );
}
    public function Dashboardindex(Request $request)
    {
        $locale = 'en';
        $user = $request->user();
        $query = Product::query()->with([
            'categories.translations',
            'translations',
            'variants.images',
            'variants.color',
            'variants.size'
        ]);
        // Admin can see all products
        // Seller can only see their own products
        if ($user->role === 'seller') {

            $query->where('seller_id', $user->seller->id);
        }
        // ✅ Product search
        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search, $locale) {

                $q->whereHas('translations', function ($t) use ($search, $locale) {

                    $t->where('locale', $locale)
                        ->where(function ($tt) use ($search) {

                            $tt->where('name', 'like', "%{$search}%")
                                ->orWhere('description', 'like', "%{$search}%");
                        });
                })
                    ->orWhere('id', 'like', "%{$search}%");
            });
        }

        // ✅ Category filter
        if (
            $request->filled('category') &&
            $request->category != 'all' &&
            $request->category != 'undefined'
        ) {

            $query->whereHas('categories.translations', function ($q) use ($request, $locale) {

                $q->where('locale', $locale)
                    ->where('name', $request->category);
            });
        }

        // ✅ Price range filter (check both base_price and variant prices)
        if ($request->filled('min_price') && $request->filled('max_price')) {
            $min = $request->min_price;
            $max = $request->max_price;

            $query->where(function ($q) use ($min, $max) {
                // base price in range
                $q->whereBetween('base_price', [$min, $max])
                    // or at least one variant in range
                    ->orWhereHas('variants', function ($sub) use ($min, $max) {
                        $sub->whereBetween('price', [$min, $max]);
                    });
            });
        }

        // ✅ Size filter
        if ($request->filled('size')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('size', $request->size);
            });
        }

        // ✅ Color filter
        if ($request->filled('color')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('color', $request->color);
            });
        }

        // ✅ Sorting
        if ($request->filled('sort')) {

            $sort = $request->get('sort');  // oldest, newest, price_asc, price_desc

            switch ($sort) {

                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;

                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;

                case 'asc':
                case 'desc':
                    $direction = $sort; // asc or desc

                    $query
                        ->select('products.*')
                        ->selectRaw("
        COALESCE(
            (
                SELECT MIN(price)
                FROM variants
                WHERE variants.product_id = products.id
            ),
            products.base_price
        ) as effective_price
    ")
                        ->orderBy('effective_price', $direction);
                    break;
            }
        } else {
            $query->latest();
        }
        // ✅ limit (per page)
        $limit = $request->get('limit', 20); // default = 12

        return response()->json($query->paginate($limit));
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'category_id' => 'nullable|numeric',
                'base_price' => 'nullable|numeric',
                'stock' => 'nullable|numeric',
                'base_images' => 'nullable|array',
                'is_active' => 'boolean',

                // ✅ Translations optional
                'translations' => 'required|array',
                'translations.*.locale' => 'required_with:translations|string|max:20',
                'translations.*.name' => 'required_with:translations|string|max:50',
                'translations.*.description' => 'required_with:translations|string|max:50',
                // ✅ Variants optional
                'variants' => 'nullable|array',
                'variants.*.color_id' => 'required_with:variants|string|max:100',
                'variants.*.size_id' => 'required_with:variants|string|max:50',
                'variants.*.price' => 'required_with:variants|numeric|min:0',
                'variants.*.stock' => 'required_with:variants|integer|min:0',
                'variants.*.sku' => 'nullable:variants|string|min:0',
                'variants.*.images' => 'required_with:variants|array',
            ],
        );
        $validator->after(function ($validator) use ($request) {
            $variants = $request->input('variants');
            $baseImages = $request->file('base_images');

            if (empty($variants) && empty($baseImages)) {
                $validator->errors()->add(
                    'base_images',
                    'At least one base image is required when no variants exist'
                );
            }
        });
        $validated = $validator->validate();

        /**
         * @var \App\Models\User $user
         */

        $sellerId = $request->user()->seller->id;
        $Slug = Str::slug($validated['translations'][0]['name']);
        if (
            Product::where('slug', $Slug)
            ->exists()
        ) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => [
                    'slug' => ['This slug is already in use.'],
                ],
            ], 422);
        }
        try {
            DB::beginTransaction();
            // ✅ Create Product
            $product = Product::create([
                'seller_id' => $sellerId,
                'slug' => $Slug,
                'base_price' => $validated['base_price'],
                'stock' => $validated['stock'],
                'is_active' => $validated['status'] ?? 1,
            ]);

            // Trannlations
            foreach ($request->translations as $translationsData) {

                Product_translations::create(
                    [
                        'product_id' => $product->id,
                        'locale' => $translationsData['locale'],
                        'name' => $translationsData['name'],
                        'description' => $translationsData['description'],

                    ]
                );
            }
            if (!empty($validated['category_id'])) {
                $categoryIds = (array) $validated['category_id'];
                $product->categories()->attach($categoryIds);
            }
            // ✅ Only create variants if they exist
            if (!empty($validated['variants'])) {
                foreach ($request->variants as $vIndex => $variantData) {

                    $variant = Variant::updateOrCreate(
                        ['id' => $variantData['id']],
                        [
                            'product_id' => $product->id,
                            'price' => $variantData['price'],
                            'stock' => $variantData['stock'],
                            'color_id' => $variantData['color_id'],
                            'size_id' => $variantData['size_id'],
                            'sku' => $variantData['sku'] ?? null,
                        ]
                    );

                    $imagesMeta = $variantData['images'] ?? [];

                    foreach ($imagesMeta as $imgIndex => $imgMeta) {

                        if ($imgMeta['type'] === 'new') {

                            // 🔥 THIS IS THE IMPORTANT LINE
                            $file = $request->file("variants.$vIndex.images.$imgIndex.file");

                            if (!$file) {
                                continue;
                            }

                            $path = $file->store('uploads', 'public');

                            VariantImage::create([
                                'variant_id' => $variant->id,
                                'file_path' => $path,
                                'sort_order' => (int) $imgMeta['sort_order'],
                                'is_main' => (int) $imgMeta['sort_order'] === 0,
                            ]);
                        }
                    }
                }
            } else {
                if (!empty($validated['base_images'])) {
                    $images = [];

                    foreach ($validated['base_images'] as $img) {
                        $path = $img->store('uploads', 'public');
                        $images[] = $path;
                    }

                    // ✅ assign array at once
                    $product->update([
                        'base_images' => $images,
                    ]);
                }
            }
            DB::commit();
            return response()->json($product->load('variants.images'), 201);
        } catch (\Throwable $e) {
            // ❌ If any step failed → rollback
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create product',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show1(string $id)
    {
        $Product = Product::with(
            'categories',
            'variants.images',
            'variants.color',   // include color relation
            'variants.size'
        )->find($id);

        if (!$Product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($Product);
    }

    public function show($id, Request $request)
    {
        $locale = $request->get('locale', 'en');

        $product = Product::with([
            'categories',
            'seller',
            'variants.images',
            'variants.color',   // include color relation
            'variants.size',
            'translations'
            // 'translations' => function ($query) use ($locale) {
            //     $query->where('locale', $locale);
            // }
        ])->findOrFail($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return DB::transaction(function () use ($request, $id) {
        // 1️⃣ VALIDATION
        $validator = Validator::make($request->all(), [

            'category_id' => 'nullable',
            'base_price' => 'nullable|numeric',
            'stock' => 'nullable|numeric',
            'base_images' => 'nullable|array',
            'deleted_base_images' => 'nullable|array',
            'is_active' => 'boolean',

            // ✅ Translations optional
            'translations' => 'required|array',
            'translations.*.locale' => 'required_with:translations|string|max:20',
            'translations.*.name' => 'required_with:translations|string|max:50',
            'translations.*.description' => 'required_with:translations|string|max:50',

            // Variants
            'variants' => 'nullable|array',
            // 'variants.*.id' => 'required|numeric',
            'variants.*.color_id' => 'required_with:variants|string|max:100',
            'variants.*.size_id' => 'required_with:variants|string|max:50',
            'variants.*.price' => 'required_with:variants|numeric|min:0',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
            'variants.*.sku' => 'nullable|string|min:0',
            'variants.*.images' => 'nullable|array',
            'variants.*.images.*.type' => 'required|in:existing,new',
            'variants.*.images.*.sort_order' => 'required|integer|min:0',
            'variants.*.images.*.file_path' => 'required_if:variants.*.images.*.type,existing',
            'variants.*.deleted_images' => 'nullable|array',
        ]);

        $validator->after(function ($validator) use ($request) {
            $variants = $request->input('variants');
            $newBaseImages = $request->file('base_images', []);
            $existingBaseImages = $request->input('existing_base_images', []);

            if (empty($variants) && count($newBaseImages) === 0 && count($existingBaseImages) === 0) {
                $validator->errors()->add(
                    'base_images',
                    'At least one base image is required when no variants exist'
                );
            }
        });

        $validated = $validator->validate();

        $product = Product::findOrFail($id);

        /*
        |----------------------------------------------------------------------
        | BASE IMAGES HANDLING (unchanged)
        |---------------------------------------------------------------------- 
        */
        $existingImages = $product->base_images ?? [];

        if ($request->filled('deleted_base_images')) {
            foreach ($request->deleted_base_images as $img) {
                Storage::disk('public')->delete($img);
                $existingImages = array_values(array_diff($existingImages, [$img]));
            }
        }

        if ($request->hasFile('base_images')) {
            foreach ($request->file('base_images') as $file) {
                $path = $file->store('uploads', 'public');
                $existingImages[] = $path;
            }
        }

        $validated['base_images'] = $existingImages;
        $product->update($validated);
        if ($request->filled('category_id') && $request->category_id!='undefined') {
            $product->categories()->sync([(int) $request->category_id]);
        }
      /*
|--------------------------------------------------------------------------
| VARIANTS HANDLING
|--------------------------------------------------------------------------
*/

// Variants sent from frontend
$incomingVariants = $request->input('variants', []);

// Existing variant IDs belonging to this product
$existingVariantIds = $product->variants()
    ->pluck('id')
    ->toArray();

// IDs that still exist after this update
$keptVariantIds = [];

foreach ($incomingVariants as $vIndex => $variantData) {

    /*
    |--------------------------------------------------------------------------
    | UPDATE EXISTING VARIANT
    |--------------------------------------------------------------------------
    */

    if (!empty($variantData['id'])) {

        // IMPORTANT:
        // Make sure the variant belongs to this product
        $variant = $product->variants()
            ->where('id', $variantData['id'])
            ->firstOrFail();

        $variant->update([
            'price' => $variantData['price'],
            'stock' => $variantData['stock'],
            'color_id' => $variantData['color_id'],
            'size_id' => $variantData['size_id'],
            'sku' => $variantData['sku'] ?? null,
        ]);

        $keptVariantIds[] = $variant->id;
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE NEW VARIANT
    |--------------------------------------------------------------------------
    */

    else {

        $variant = $product->variants()->create([
            'price' => $variantData['price'],
            'stock' => $variantData['stock'],
            'color_id' => $variantData['color_id'],
            'size_id' => $variantData['size_id'],
            'sku' => $variantData['sku'] ?? null,
        ]);

        $keptVariantIds[] = $variant->id;
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE REMOVED VARIANT IMAGES
    |--------------------------------------------------------------------------
    */

    if (!empty($variantData['deleted_images'])) {

        foreach ($variantData['deleted_images'] as $path) {

            Storage::disk('public')->delete($path);

            VariantImage::where('variant_id', $variant->id)
                ->where('file_path', $path)
                ->delete();
        }
    }

    /*
    |--------------------------------------------------------------------------
    | VARIANT IMAGES
    |--------------------------------------------------------------------------
    */

    $imagesMeta = $variantData['images'] ?? [];

    $uploadedFiles = $request->file(
        "variants.$vIndex.images",
        []
    );

    /*
    |--------------------------------------------------------------------------
    | SORT IMAGES
    |--------------------------------------------------------------------------
    */

    usort(
        $imagesMeta,
        fn($a, $b) =>
            intval($a['sort_order']) <=> intval($b['sort_order'])
    );

    /*
    |--------------------------------------------------------------------------
    | REBUILD VARIANT IMAGES
    |--------------------------------------------------------------------------
    */

    // Get old images before deleting them
    $oldImages = VariantImage::where('variant_id', $variant->id)
        ->get();

    /*
    |--------------------------------------------------------------------------
    | Delete images that are no longer referenced
    |--------------------------------------------------------------------------
    */

    $incomingExistingPaths = collect($imagesMeta)
        ->where('type', 'existing')
        ->pluck('file_path')
        ->filter()
        ->values()
        ->toArray();

    foreach ($oldImages as $oldImage) {

        if (!in_array($oldImage->file_path, $incomingExistingPaths)) {

            Storage::disk('public')->delete(
                $oldImage->file_path
            );
        }
    }

    // Remove database records
    VariantImage::where('variant_id', $variant->id)->delete();

    /*
    |--------------------------------------------------------------------------
    | CREATE IMAGES AGAIN IN CORRECT ORDER
    |--------------------------------------------------------------------------
    */

    $uploadIndex = 0;

    foreach ($imagesMeta as $index => $img) {

        /*
        |--------------------------------------------------------------------------
        | EXISTING IMAGE
        |--------------------------------------------------------------------------
        */

        if ($img['type'] === 'existing') {

            VariantImage::create([
                'variant_id' => $variant->id,
                'file_path' => $img['file_path'],
                'sort_order' => $index,
                'is_main' => $index === 0,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | NEW IMAGE
        |--------------------------------------------------------------------------
        */

        elseif ($img['type'] === 'new') {

            $file = $uploadedFiles[$uploadIndex]['file'] ?? null;

            if (!$file) {
                $uploadIndex++;
                continue;
            }

            $path = $file->store('uploads', 'public');

            VariantImage::create([
                'variant_id' => $variant->id,
                'file_path' => $path,
                'sort_order' => $index,
                'is_main' => $index === 0,
            ]);

            $uploadIndex++;
        }
    }
}

/*
|--------------------------------------------------------------------------
| DELETE VARIANTS REMOVED FROM FRONTEND
|--------------------------------------------------------------------------
*/
$variantsToDelete = array_diff(
    $existingVariantIds,
    $keptVariantIds
);

foreach ($variantsToDelete as $variantId) {

    $variant = $product->variants()
        ->where('id', $variantId)
        ->first();

    if (!$variant) {
        continue;
    }

    /*
     |--------------------------------------------------------------------------
     | Check whether variant was used in an order
     |--------------------------------------------------------------------------
     */

    if ($variant->orderItems()->exists()) {

        return response()->json([
            'message' => 'This variant cannot be deleted because it has already been used in an order.',
            'variant_id' => $variant->id,
        ], 422);
    }

    /*
     |--------------------------------------------------------------------------
     | Delete variant images from storage
     |--------------------------------------------------------------------------
     */

    $images = VariantImage::where(
        'variant_id',
        $variant->id
    )->get();

    foreach ($images as $image) {

        Storage::disk('public')->delete(
            $image->file_path
        );
    }

    /*
     |--------------------------------------------------------------------------
     | Delete variant images from database
     |--------------------------------------------------------------------------
     */

    VariantImage::where(
        'variant_id',
        $variant->id
    )->delete();

    /*
     |--------------------------------------------------------------------------
     | Delete variant
     |--------------------------------------------------------------------------
 */

    $variant->delete();
}
        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->load('variants', 'variants.images')
        ]);
        });
    }

private function removeProductFromCmsSections(int $productId): void
{
    $pages = Page::query()->get();

    foreach ($pages as $page) {

        // Make sure sections is an array
        if (!is_array($page->sections)) {
            continue;
        }

        $changed = false;

        $sections = collect($page->sections)
            ->map(function ($section) use ($productId, &$changed) {

                /*
                |--------------------------------------------------------------------------
                | Countdown Offers
                |--------------------------------------------------------------------------
                */
                if (
                    in_array(
                        $section['type'] ?? null,
                        [
                            'generalCountdownOffers',
                            'CountDownOffers',
                            'countdownOffers',
                        ],
                        true
                    )
                    && isset($section['offers'])
                    && is_array($section['offers'])
                ) {

                    $originalCount = count($section['offers']);

                    $section['offers'] = array_values(
                        array_filter(
                            $section['offers'],
                            function ($offer) use ($productId) {

                                return (string) ($offer['offerProduct'] ?? '') !==
                                    (string) $productId;
                            }
                        )
                    );

                    if (
                        count($section['offers']) !== $originalCount
                    ) {
                        $changed = true;
                    }
                }

                return $section;
            })
            ->values()
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | Save only if something actually changed
        |--------------------------------------------------------------------------
        */
        if ($changed) {
            $page->sections = $sections;
            $page->save();
        }
    }
}
    /**
     * Remove the specified resource from storage.
     */


public function destroy(Request $request)
{
    $validated = $request->validate([
        'ids' => 'required|array|min:1',
        'ids.*' => 'integer|exists:products,id',
    ]);

    DB::beginTransaction();

    try {

        $products = Product::whereIn('id', $validated['ids'])->get();

        foreach ($products as $product) {

            /*
            |--------------------------------------------------------------------------
            | Check if product has been used in an order
            |--------------------------------------------------------------------------
            */

            $hasOrders = $product->orderItems()->exists();

            /*
            |--------------------------------------------------------------------------
            | Product is used in an order
            |--------------------------------------------------------------------------
            */

            if ($hasOrders) {

                // Remove it from CMS sections
                $this->removeProductFromCmsSections($product->id);

                // Don't physically delete it
                $product->update([
                    'is_active' => false,
                ]);

                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Product has never been ordered
            |--------------------------------------------------------------------------
            */

            // Remove it from CMS first
            $this->removeProductFromCmsSections($product->id);

            // Now it is safe to delete
            $product->delete();
        }

        DB::commit();

        return response()->json([
            'message' => 'Products deleted successfully',
        ]);

    } catch (\Throwable $e) {

        DB::rollBack();

        return response()->json([
            'message' => 'Failed to delete products.',
            'error' => $e->getMessage(),
        ], 500);
    }
}
    // ✅ Create variant with images
    public function storeVariant(Request $request, $productId)
    {

        $validated = $request->validate([
            'color' => 'required|string|max:100',
            'size' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'images' => 'array',
            'images.*' => 'string' // store image URLs (can be s3, local path, etc.)
        ]);

        $product = Product::findOrFail($productId);

        $variant = $product->variants()->create($validated);
        // attach images
        if ($request->has('images')) {
            foreach ($request->images as $img) {
                $variant->images()->create(['image_url' => $img]);
            }
        }

        return response()->json($variant->load('images'), 201);
    }

    public function byCategories(Request $request)
    {
        $categoryIds = $request->input('category_ids', []);

        return response()->json(
            Product::with('categories')
                ->where('is_active', true)
                ->whereHas('categories', function ($q) use ($categoryIds) {
                    $q->whereIn('categories.id', $categoryIds);
                })
                ->get()
        );
    }

    public function filterByNames(Request $request)
    {
        $ids = $request->input('ids', []);
        $names = $request->input('names', []);
        if (is_string($ids)) {
            $ids = explode(',', $ids);
        }
        if (empty($ids) && empty($names)) {
            return response()->json([]);
        }

        $query = Product::query()
            ->where('is_active', true)
            ->with(['variants.images', 'translations']);
        $query->where(function ($q) use ($ids, $names) {
            if (!empty($ids)) {
                $q->whereIn('id', $ids);
            }

            if (!empty($names)) {
                $q->orWhereIn('name', $names);
            }
        });

        return response()->json($query->get());
    }

    public function getAllProductsName()
    {
        $locale = $request->locale ?? app()->getLocale();

        return response()->json(
            Product::with([
                'translations' => function ($q) use ($locale) {
                    $q->where('locale', $locale)
                        ->select('product_id', 'name');
                }
            ])
                ->where('is_active', true)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->translations->first()?->name,
                    ];
                })
        );
    }
}
