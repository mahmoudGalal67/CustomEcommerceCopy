<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateFeatureRequest;
use App\Models\Feature;

class FeatureController extends Controller
{
    public function show()
    {
        $feature = Feature::first();

        if (!$feature) {
            $feature = Feature::create([
                'data' => [
                    'website_name' => '',

                    'show_contact_page' => true,
                    'show_about_page' => true,
                    'show_terms_page' => true,
                    'show_privacy_page' => true,

                    'default_shipping_address' => '',
                    'default_billing_address' => '',
                    'address_label' => 'Home',

                    'email_notifications' => true,

                    'languages' => ['en'],
                    'currency' => 'USD',

                    'preferred_delivery_time' => '',

                    'leave_at_door' => false,
                    'signature_required' => false,

                    'contact_email' => '',
                    'contact_phone' => '',
                    'contact_whatsapp' => '',

                    'coupon_code' => '',

                    'footer_font_size' => 14,

                    'background_image' => '',
                    'store_logo' => '',
                    'favicon' => '',

                    'seo_title' => '',
                    'seo_description' => '',
                    'seo_keywords' => '',

                    'show_featured_products' => true,
                    'show_best_sellers' => true,
                    'show_new_arrivals' => true,

                    'payment_methods' => [],
                ],
            ]);
        }

        return response()->json($feature->data);
    }

    public function update(UpdateFeatureRequest $request)
    {
        $feature = Feature::first();

        if (!$feature) {
            $feature = Feature::create([
                'data' => [],
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Existing settings
        |--------------------------------------------------------------------------
        */

        $existing = $feature->data ?? [];

        if (is_string($existing)) {
            $existing = json_decode($existing, true) ?? [];
        }

        /*
        |--------------------------------------------------------------------------
        | Validated normal fields
        |--------------------------------------------------------------------------
        */

        $data = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | Background Image
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('background_image')) {
            $path = $request
                ->file('background_image')
                ->store('features', 'public');

            $data['background_image'] = "/storage/{$path}";
        }

        /*
        |--------------------------------------------------------------------------
        | Store Logo
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('store_logo')) {
            $path = $request
                ->file('store_logo')
                ->store('features', 'public');

            $data['store_logo'] = "/storage/{$path}";
        }

        /*
        |--------------------------------------------------------------------------
        | Favicon
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('favicon')) {
            $path = $request
                ->file('favicon')
                ->store('features', 'public');

            $data['favicon'] = "/storage/{$path}";
        }

        /*
        |--------------------------------------------------------------------------
        | Update settings
        |--------------------------------------------------------------------------
        */

        $feature->update([
            'data' => array_merge($existing, $data),
        ]);

        return response()->json([
            'message' => 'Settings updated successfully.',
            'data' => $feature->data,
        ]);
    }
}