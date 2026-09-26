<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendOrderToN8n implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 3;

    public $backoff = [10, 60, 300];

    public function handle(OrderCreated $event): void
    {
        $order = $event->order->load([
            'user',
            'items.product',
            'items.variant',
            'sellerOrders.seller',
        ]);

        $payload = [
            'event' => 'order.created',

            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total' => $order->total,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'created_at' => $order->created_at?->toDateTimeString(),
            ],

            'customer' => [
                'id' => $order->user?->id,
                'name' => $order->user?->name,
                'email' => $order->user?->email,
            ],

            'items' => $order->items->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product?->name,

                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ];
            })->values()->toArray(),

            'sellers' => $order->sellerOrders->map(function ($sellerOrder) {
                return [
                    'seller_order_id' => $sellerOrder->id,

                    'seller_id' => $sellerOrder->seller_id,

                    'seller_name' =>
                    $sellerOrder->seller?->shop_name
                        ?? $sellerOrder->seller?->user?->name,

                    'status' => $sellerOrder->status,
                ];
            })->values()->toArray(),
        ];

        Log::info('Sending order to n8n', [
            'order_id' => $order->id,
        ]);

        $response = Http::timeout(15)
            ->acceptJson()
            ->post(
                config('services.n8n.order_created_webhook'),
                $payload
            );

        if ($response->failed()) {

            Log::error('n8n webhook failed', [
                'order_id' => $order->id,
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            $response->throw();
        }

        Log::info('Order successfully sent to n8n', [
            'order_id' => $order->id,
        ]);
    }

    public function failed(
        OrderCreated $event,
        \Throwable $exception
    ): void {
        Log::error('SendOrderToN8n permanently failed', [
            'order_id' => $event->order->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
