<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\KnowledgeBaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class KnowledgeBaseController extends Controller
{
    public function indexProduct(
        Product $product,
        KnowledgeBaseService $knowledgeBase
    ): JsonResponse {
        try {
            $knowledgeBase->indexProduct($product);

            return response()->json([
                'message' => 'Product indexed successfully.',
                'product_id' => $product->id,
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to index product', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to index product.',
            ], 500);
        }
    }

    public function indexAllProducts(
    KnowledgeBaseService $knowledgeBase
): JsonResponse {
    try {
        $result = $knowledgeBase->indexAllProducts();

        return response()->json([
            'message' => 'Product indexing completed successfully.',
            ...$result,
        ]);
    } catch (\Throwable $e) {
        Log::error('Failed to index products', [
            'error' => $e->getMessage(),
        ]);

        return response()->json([
            'message' => 'Failed to index products.',
            'error' => $e->getMessage(),
        ], 500);
    }
}
}