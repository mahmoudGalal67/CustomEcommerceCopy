<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\KnowledgeBaseService;
use Illuminate\Console\Command;

class IndexProductsKnowledge extends Command
{
    protected $signature = 'knowledge:index-products';

    protected $description =
    'Index all active products into Qdrant';

    public function handle(
        KnowledgeBaseService $knowledge
    ): int {
        $knowledge->ensureCollection();

        $count = 0;

        Product::where('is_active', true)
            ->chunkById(50, function ($products) use (
                $knowledge,
                &$count
            ) {
                foreach ($products as $product) {
                    try {
                        $knowledge->indexProduct($product);

                        $count++;

                        $this->info(
                            "Indexed product #{$product->id}"
                        );
                    } catch (\Throwable $e) {
                        $this->error(
                            "Failed product #{$product->id}: "
                                . $e->getMessage()
                        );
                    }
                }
            });

        $this->newLine();

        $this->info(
            "Finished. {$count} products indexed."
        );

        return self::SUCCESS;
    }
}
