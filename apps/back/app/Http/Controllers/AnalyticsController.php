<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request)
    {
        $period = $request->period ?? '360d';

        $startDate = match ($period) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '12m' => now()->subMonths(12),
            default => now()->subMonths(12),
        };

        $sellerId = null;

        $format = $period === '12m'
            ? '%Y-%m'
            : '%Y-%m-%d';
        $user = request()->user();
        // If the logged-in user is a seller
        if ($user->role == 'seller') {
            $sellerId = $user->seller->id;
        }

        return response()->json([
            'cards' => $this->cards($startDate, $sellerId),

            'revenue_over_time' => $this->revenueOverTime($format, $startDate, $sellerId),

            'orders_by_status' => $this->ordersByStatus($startDate, $sellerId),

            'top_products' => $this->topProducts($startDate, $sellerId),

            'revenue_by_category' => $this->revenueByCategory($startDate, $sellerId),

            'low_stock_products' => $this->lowStockProducts($sellerId),
        ]);
    }

    private function cards($startDate, $sellerId)
    {
        $query = DB::table('orders')
            ->where('orders.created_at', '>=', $startDate)
            ->where('payment_status', 'paid');

        if ($sellerId) {

            $query->join(
                'seller_orders',
                'orders.id',
                '=',
                'seller_orders.order_id'
            )->where(
                'seller_orders.seller_id',
                $sellerId
            );

            $revenue = $query->sum('seller_orders.subtotal');
        } else {

            $revenue = $query->sum('orders.subtotal');
        }

        return [
            'revenue' => $revenue,
            'orders' => $query->count(),
        ];
    }

    private function revenueOverTime($format, $startDate, $sellerId)
    {
        if ($sellerId) {

            return DB::table('seller_orders')
                ->selectRaw("DATE_FORMAT(created_at,'{$format}') as date")
                ->selectRaw('SUM(subtotal) as revenue')
                ->where('seller_id', $sellerId)
                ->where('created_at', '>=', $startDate)
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        }

        return DB::table('orders')
            ->selectRaw("DATE_FORMAT(created_at,'{$format}') as date")
            ->selectRaw('SUM(subtotal) as revenue')
            ->where('created_at', '>=', $startDate)
            ->where('status', '!=', 'cancelled')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    private function ordersByStatus($startDate, $sellerId)
    {
        if ($sellerId) {

            return DB::table('seller_orders')
                ->select('status')
                ->selectRaw('COUNT(*) as total')
                ->where('seller_id', $sellerId)
                ->where('created_at', '>=', $startDate)
                ->groupBy('status')
                ->get();
        }

        return DB::table('orders')
            ->select('status')
            ->selectRaw('COUNT(*) as total')
            ->where('created_at', '>=', $startDate)
            ->groupBy('status')
            ->get();
    }

    private function topProducts($startDate, $sellerId)
    {
        $query = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')

            // Join the purchased variant
            ->leftJoin('variants', 'variants.id', '=', 'order_items.variant_id')

            // Get only the main image of that variant
            ->leftJoin('variant_images', function ($join) {
                $join->on('variant_images.variant_id', '=', 'variants.id')
                    ->where('variant_images.is_main', true);
            });

        if ($sellerId) {
            $query->where('products.seller_id', $sellerId);
        }

        $products = $query
            ->where('orders.created_at', '>=', $startDate)
            ->select(
                'products.id',
                'products.slug',
                'products.base_images',
                'variant_images.file_path as variant_image'
            )
            ->selectRaw('SUM(order_items.quantity) as sold')
            ->groupBy(
                'products.id',
                'products.slug',
                'products.base_images',
                'variant_images.file_path'
            )
            ->orderByDesc('sold')
            ->limit(10)
            ->get();

        return $products->map(function ($product) {

            $image = null;

            // Use base image first
            if (!empty($product->base_images)) {
                $baseImages = json_decode($product->base_images, true);

                if (!empty($baseImages)) {
                    $image = $baseImages[0];
                }
            }

            // Otherwise use the purchased variant image
            if (!$image) {
                $image = $product->variant_image;
            }

            return [
                'id' => $product->id,
                'slug' => $product->slug,
                'sold' => (int) $product->sold,
                'image' => $image,
            ];
        });
    }

    private function revenueByCategory($startDate, $sellerId)
    {
        $query = DB::table('order_items')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('category_product', 'category_product.product_id', '=', 'products.id')
            ->join('categories', 'categories.id', '=', 'category_product.category_id')
            ->join(
                'category_translations',
                function ($join) {
                    $join->on(
                        'category_translations.category_id',
                        '=',
                        'categories.id'
                    )
                        ->where('category_translations.locale', app()->getLocale());
                }
            )
            ->join('orders', 'orders.id', '=', 'order_items.order_id');

        if ($sellerId) {
            $query->where('products.seller_id', $sellerId);
        }

        return $query
            ->where('orders.created_at', '>=', $startDate)
            ->select(
                'categories.id',
                'category_translations.name'
            )
            ->selectRaw('SUM(order_items.line_total) as revenue')
            ->groupBy(
                'categories.id',
                'category_translations.name'
            )
            ->orderByDesc('revenue')
            ->get();
    }

    private function lowStockProducts($sellerId)
    {
        $query = DB::table('products')
            ->leftJoin('variants', 'variants.product_id', '=', 'products.id')
            ->leftJoin('variant_images', function ($join) {
                $join->on('variant_images.variant_id', '=', 'variants.id')
                    ->where('variant_images.is_main', true);
            });

        if ($sellerId) {
            $query->where('products.seller_id', $sellerId);
        }

        $products = $query
            ->select(
                'products.id',
                'products.slug',
                'products.base_images',
                'variant_images.file_path as variant_image',
                DB::raw('COALESCE(variants.stock, products.stock) as stock'),
                'variants.color_id',
                'variants.size_id'
            )
            ->whereRaw('COALESCE(variants.stock, products.stock) < 10')
            ->orderBy('stock')
            ->get();

        return $products->map(function ($product) {

            $image = null;

            // Base product image
            if (!empty($product->base_images)) {
                $baseImages = is_array($product->base_images)
                    ? $product->base_images
                    : json_decode($product->base_images, true);

                if (!empty($baseImages)) {
                    $image = $baseImages[0];
                }
            }

            // Fallback to variant image
            if (!$image) {
                $image = $product->variant_image;
            }

            return [
                'id' => $product->id,
                'slug' => $product->slug,
                'stock' => (int) $product->stock,
                'color_id' => $product->color_id,
                'size_id' => $product->size_id,
                'image' => $image,
            ];
        });
    }
}
