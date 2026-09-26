<?php

namespace App\Http\Controllers;

use App\Events\OrderCreated;
use App\Models\Order;
use App\Models\SellerOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        try {
            // Use env() directly to avoid signature mismatch
            $event = Webhook::constructEvent(
                $payload,
                $signature,
                env('STRIPE_WEBHOOK_SECRET')
            );
        } catch (\Exception $e) {
            Log::error('Stripe webhook signature failed', [
                'error' => $e->getMessage(),
                'payload' => $payload,
            ]);

            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Only handle successful payments
        if ($event->type !== 'payment_intent.succeeded') {
            Log::info('Stripe webhook ignored event', [
                'type' => $event->type,
            ]);
            return response()->json(['status' => 'ignored']);
        }

        $paymentIntent = $event->data->object;
        $orderId = $paymentIntent->metadata->order_id ?? null;

        if (!$orderId) {
            Log::error('Stripe webhook missing order_id', [
                'payment_intent' => $paymentIntent->id,
            ]);
            return response()->json(['error' => 'Missing order_id'], 400);
        }

        try {
            $order = DB::transaction(function () use ($orderId, $paymentIntent) {

                $order = Order::with([
                    'items.variant',
                    'items.product',
                    'sellerOrders'
                ])
                    ->lockForUpdate()
                    ->findOrFail($orderId);

                // Prevent duplicate webhook processing
                if ($order->payment_status === 'paid') {
                    Log::info('Order already paid', [
                        'order_id' => $orderId,
                    ]);

                    return;
                }

                // Update main order
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing',
                    'payment_intent_id' => $paymentIntent->id,
                ]);

                // Update seller orders
                SellerOrder::where('order_id', $order->id)
                    ->update([
                        'status' => 'processing',
                    ]);

                // Update stock
                foreach ($order->items as $item) {

                    if ($item->variant_id) {

                        $variant = $item->variant()
                            ->lockForUpdate()
                            ->first();

                        if (!$variant) {
                            throw new \Exception(
                                "Variant {$item->variant_id} not found"
                            );
                        }

                        if ($variant->stock < $item->quantity) {
                            throw new \Exception(
                                "Insufficient stock for variant {$variant->id}"
                            );
                        }

                        $variant->decrement(
                            'stock',
                            $item->quantity
                        );
                    } else {

                        $product = $item->product()
                            ->lockForUpdate()
                            ->first();

                        if (!$product) {
                            throw new \Exception(
                                "Product {$item->product_id} not found"
                            );
                        }

                        if ($product->stock < $item->quantity) {
                            throw new \Exception(
                                "Insufficient stock for product {$product->id}"
                            );
                        }

                        $product->decrement(
                            'stock',
                            $item->quantity
                        );
                    }
                }
                Log::info('Stripe webhook processed successfully', [
                    'order_id' => $orderId,
                    'payment_intent' => $paymentIntent->id,
                ]);
                return $order;
            });
            // Transaction is finished successfully here
            if ($order) {
                event(new OrderCreated($order));
            }
        } catch (\Throwable $e) {
            Log::error('Stripe webhook processing failed', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Webhook processing failed'], 500);
        }

        return response()->json(['status' => 'success']);
    }
}
