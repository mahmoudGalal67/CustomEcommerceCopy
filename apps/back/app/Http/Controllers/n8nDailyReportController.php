<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class n8nDailyReportController extends Controller
{
    public function getN8nDailyReport(?int $sellerId = null): array
    {
        // if (
        //     $request->header('X-Automation-Key')
        //     !== config('services.n8n.key')
        // ) {
        //     abort(401);
        // }
        $todayStart = now()->startOfDay();
        $tomorrowStart = now()->addDay()->startOfDay();

        $yesterdayStart = now()->subDay()->startOfDay();

        $last7DaysStart = now()->subDays(7)->startOfDay();
        $previous7DaysStart = now()->subDays(14)->startOfDay();

        $last30DaysStart = now()->subDays(30)->startOfDay();
        $previous30DaysStart = now()->subDays(60)->startOfDay();

        // TODAY
        $today = $this->getPeriodSummary(
            $todayStart,
            $tomorrowStart,
            $sellerId
        );

        // YESTERDAY
        $yesterday = $this->getPeriodSummary(
            $yesterdayStart,
            $todayStart,
            $sellerId
        );

        // LAST 7 DAYS
        $last7Days = $this->getPeriodSummary(
            $last7DaysStart,
            $tomorrowStart,
            $sellerId
        );

        // PREVIOUS 7 DAYS
        $previous7Days = $this->getPeriodSummary(
            $previous7DaysStart,
            $last7DaysStart,
            $sellerId
        );

        // LAST 30 DAYS
        $last30Days = $this->getPeriodSummary(
            $last30DaysStart,
            $tomorrowStart,
            $sellerId
        );

        // PREVIOUS 30 DAYS
        $previous30Days = $this->getPeriodSummary(
            $previous30DaysStart,
            $last30DaysStart,
            $sellerId
        );

        return [
            'generated_at' => now()->toDateTimeString(),

            'today' => $today,

            'yesterday' => $yesterday,

            'daily_comparison' => [
                'revenue_change_percent' => $this->percentageChange(
                    $today['revenue'],
                    $yesterday['revenue']
                ),

                'orders_change_percent' => $this->percentageChange(
                    $today['orders'],
                    $yesterday['orders']
                ),

                'average_order_value_change_percent' =>
                $this->percentageChange(
                    $today['average_order_value'],
                    $yesterday['average_order_value']
                ),
            ],

            'last_7_days' => $last7Days,

            'previous_7_days' => $previous7Days,

            'weekly_comparison' => [
                'revenue_change_percent' => $this->percentageChange(
                    $last7Days['revenue'],
                    $previous7Days['revenue']
                ),

                'orders_change_percent' => $this->percentageChange(
                    $last7Days['orders'],
                    $previous7Days['orders']
                ),
            ],

            'last_30_days' => $last30Days,

            'previous_30_days' => $previous30Days,

            'monthly_comparison' => [
                'revenue_change_percent' => $this->percentageChange(
                    $last30Days['revenue'],
                    $previous30Days['revenue']
                ),

                'orders_change_percent' => $this->percentageChange(
                    $last30Days['orders'],
                    $previous30Days['orders']
                ),
            ],

            // Product analytics
            'top_products_today' => $this->topProductsByPeriod(
                $todayStart,
                $tomorrowStart,
                $sellerId
            ),

            'top_products_last_7_days' => $this->topProductsByPeriod(
                $last7DaysStart,
                $tomorrowStart,
                $sellerId
            ),

            // Order status
            'today_orders_by_status' => $this->ordersByStatusPeriod(
                $todayStart,
                $tomorrowStart,
                $sellerId
            ),

            // Inventory
            'low_stock_products' => $this->lowStockProducts(
                $sellerId
            ),
        ];
    }
    private function getPeriodSummary(
        $startDate,
        $endDate,
        ?int $sellerId = null
    ): array {
        if ($sellerId) {

            $query = DB::table('seller_orders')
                ->where('seller_id', $sellerId)
                ->whereBetween(
                    'created_at',
                    [$startDate, $endDate]
                );

            $revenue = (clone $query)
                ->where('status', 'paid')
                ->sum('subtotal');

            $orders = (clone $query)
                ->count();
        } else {

            $query = DB::table('orders')
                ->whereBetween(
                    'created_at',
                    [$startDate, $endDate]
                );

            $revenue = (clone $query)
                ->where('status', 'paid')
                ->where('status', '!=', 'cancelled')
                ->sum('subtotal');

            $orders = (clone $query)->count();
        }

        $averageOrderValue = $orders > 0
            ? round($revenue / $orders, 2)
            : 0;

        return [
            'revenue' => (float) $revenue,
            'orders' => $orders,
            'average_order_value' => $averageOrderValue,
        ];
    }
    private function percentageChange(
        float|int $current,
        float|int $previous
    ): float {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round(
            (($current - $previous) / $previous) * 100,
            2
        );
    }
    private function topProductsByPeriod(
        $startDate,
        $endDate,
        ?int $sellerId = null
    ) {
        $query = DB::table('order_items')
            ->join(
                'orders',
                'orders.id',
                '=',
                'order_items.order_id'
            )
            ->join(
                'products',
                'products.id',
                '=',
                'order_items.product_id'
            );

        if ($sellerId) {
            $query->where(
                'products.seller_id',
                $sellerId
            );
        }

        return $query
            ->whereBetween(
                'orders.created_at',
                [$startDate, $endDate]
            )
            ->where('orders.payment_status', 'paid')
            ->where('orders.status', '!=', 'cancelled')

            ->select(
                'products.id',
                'products.slug'
            )

            ->selectRaw(
                'SUM(order_items.quantity) as quantity_sold'
            )

            ->selectRaw(
                'SUM(order_items.line_total) as revenue'
            )

            ->groupBy(
                'products.id',
                'products.slug'
            )

            ->orderByDesc('quantity_sold')
            ->limit(10)
            ->get();
    }
    private function ordersByStatusPeriod(
        $startDate,
        $endDate,
        ?int $sellerId = null
    ) {
        if ($sellerId) {

            return DB::table('seller_orders')
                ->join(
                    'orders',
                    'orders.id',
                    '=',
                    'seller_orders.order_id'
                )
                ->where(
                    'seller_orders.seller_id',
                    $sellerId
                )
                ->whereBetween(
                    'orders.created_at',
                    [$startDate, $endDate]
                )
                ->select('seller_orders.status')
                ->selectRaw('COUNT(*) as total')
                ->groupBy('seller_orders.status')
                ->get();
        }

        return DB::table('orders')
            ->whereBetween(
                'created_at',
                [$startDate, $endDate]
            )
            ->select('status')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('status')
            ->get();
    }
    private function lowStockProducts($sellerId)
    {
        $query = DB::table('products')
            ->leftJoin('variants', 'variants.product_id', '=', 'products.id');

        if ($sellerId) {
            $query->where('products.seller_id', $sellerId);
        }

        $products = $query
            ->select(
                'products.id',
                'products.slug',
                DB::raw('COALESCE(variants.stock, products.stock) as stock'),
                'variants.color_id',
                'variants.size_id'
            )
            ->whereRaw('COALESCE(variants.stock, products.stock) < 10')
            ->orderBy('stock')
            ->get();

        return $products->map(function ($product) {
            return [
                'id' => $product->id,
                'slug' => $product->slug,
                'stock' => (int) $product->stock,
                'color_id' => $product->color_id,
                'size_id' => $product->size_id,
            ];
        });
    }
}
