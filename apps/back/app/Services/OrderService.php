<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SellerOrder;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create Order from Cart
     */
    public function createFromCart(array $data, int $userId): Order
    {

      
        return DB::transaction(function () use ($data, $userId) {
$shipping = (float) ($data['shipping'] ?? 0);
        $tax = (float) ($data['tax'] ?? 0);
            // 1. Get cart
            $cart = Cart::with([
                'items.product',
                'items.variant'
            ])
                ->where('user_id', $userId)
                ->firstOrFail();

            // 2. Create main order
            $order = Order::create([
                'user_id' => $userId,
                'name' => $data['name'] ?? null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'],
                'adress' => $data['address'],
                'city' => $data['city'],
                'shipping'=>$shipping,
                'tax'=>$tax,
                'subtotal' => 0,
                'total' => 0,
                'status' => 'pending',
                'payment_status' => 'unpaid',
            ]);

            $orderSubtotal = 0;

            // 3. Group cart items by seller
            $itemsBySeller = $cart->items->groupBy('seller_id');

            foreach ($itemsBySeller as $sellerId => $items) {
                if (!$sellerId) {
                    throw new \Exception('Invalid seller_id in cart items');
                }

                $sellerSubtotal = 0;

                // 4. Create seller order
                $sellerOrder = SellerOrder::create([
                    'order_id' => $order->id,
                    'seller_id' => $sellerId,
                    'subtotal' => 0,
                    'status' => 'pending',
                ]);

                // 5. Create order items
                // 5. Create order items
                foreach ($items as $item) {

                    if ($item->variant) {

                        $price = $item->variant->price;
                        $productId = $item->variant->product_id;
                        $variantId = $item->variant->id;

                    } else {

                        if (!$item->product) {
                            throw new \Exception(
                                "Cart item {$item->id} has neither product nor variant"
                            );
                        }

                        $price = $item->product->base_price;
                        $productId = $item->product->id;
                        $variantId = null;
                    }

                    $lineTotal = $item->quantity * $price;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'seller_order_id' => $sellerOrder->id,
                        'product_id' => $productId,
                        'variant_id' => $variantId,
                        'unit_price' => $price,
                        'quantity' => $item->quantity,
                        'line_total' => $lineTotal,
                    ]);

                    $sellerSubtotal += $lineTotal;
                }

                $sellerOrder->update(['subtotal' => $sellerSubtotal]);
                $orderSubtotal += $sellerSubtotal;
            }

            // 6. Update totals

             $orderTotal = $orderSubtotal + $shipping + $tax;

        $order->update([
            'subtotal' => $orderSubtotal,
            'total' => $orderTotal,
        ]);

            // 7. Clear cart
            $cart->items()->delete();

            return $order;
        });
    }
}
