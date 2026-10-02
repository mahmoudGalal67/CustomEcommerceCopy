<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\category;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = trim($request->q);

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $results = collect();

        /*
        |--------------------------------------------------------------------------
        | Products
        |--------------------------------------------------------------------------
        */

        $products = Product::query()
            ->whereHas('translations', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->with(['translations'])
            ->limit(5)
            ->get()
            ->map(function ($product) {
                $translation = $product->translations
                    ->firstWhere('locale', app()->getLocale());

                return [
                    'id' => $product->id,
                    'type' => 'product',
                    'title' => $translation?->name,
                    'image' => $product->main_image[0] ?? null,
                    'url' => "products/{$product->id}",
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        $categories = category::query()
            ->whereHas('translations', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->with(['translations'])
            ->limit(5)
            ->get()
            ->map(function ($category) {
                $translation = $category->translations
                    ->firstWhere('locale', app()->getLocale());

                return [
                    'id' => $category->id,
                    'type' => 'category',
                    'title' => $translation?->name,
                    'image' => null,
                    'url' => "categories/{$category->id}",
                ];
            });

        $results = $results
            ->merge($products)
            ->merge($categories)
            ->take(10)
            ->values();

        return response()->json($results);
    }
}