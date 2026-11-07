<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Boolean fields
        |--------------------------------------------------------------------------
        */

        $booleanFields = [
            'show_contact_page',
            'show_about_page',
            'show_terms_page',
            'show_privacy_page',
            'email_notifications',
            'leave_at_door',
            'signature_required',
            'show_featured_products',
            'show_best_sellers',
            'show_new_arrivals',
            'wishlist_public',
        ];

        $normalized = [];

        foreach ($booleanFields as $field) {
            // Do not overwrite settings that were not submitted.
            if (!$this->exists($field)) {
                continue;
            }

            $value = filter_var(
                $this->input($field),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            );

            if ($value !== null) {
                $normalized[$field] = $value;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Languages
        |--------------------------------------------------------------------------
        */

        if ($this->exists('languages')) {
            $languages = $this->input('languages');

            if (is_string($languages)) {
                $decoded = json_decode($languages, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    $languages = $decoded;
                }
            }

            $normalized['languages'] = $languages;
        }

        /*
        |--------------------------------------------------------------------------
        | Payment methods
        |--------------------------------------------------------------------------
        */

        if ($this->exists('payment_methods')) {
            $paymentMethods = $this->input('payment_methods');

            if (is_string($paymentMethods)) {
                $decoded = json_decode($paymentMethods, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    $paymentMethods = $decoded;
                }
            }

            $normalized['payment_methods'] = $paymentMethods;
        }

        $this->merge($normalized);

        /*
        |--------------------------------------------------------------------------
        | Empty image values
        |--------------------------------------------------------------------------
        */

        foreach ([
            'background_image',
            'store_logo',
            'favicon',
        ] as $field) {
            $value = $this->input($field);

            if (
                in_array($value, ['', 'null', 'undefined'], true)
            ) {
                $this->request->remove($field);
            }
        }
    }

    public function rules(): array
    {
        return [
            'website_name' => 'sometimes|string|max:255',

            // Pages
            'show_contact_page' => 'sometimes|boolean',
            'show_about_page' => 'sometimes|boolean',
            'show_terms_page' => 'sometimes|boolean',
            'show_privacy_page' => 'sometimes|boolean',

            // Localization
            'languages' => 'sometimes|array',
            'languages.*' => 'string|max:10',

            'currency' => 'sometimes|string|max:10',

            // Addresses
            'address_label' => 'sometimes|string|max:100',
            'default_billing_address' => 'sometimes|nullable|string',
            'default_shipping_address' => 'sometimes|nullable|string',

            // SEO
            'seo_title' => 'sometimes|nullable|string|max:255',
            'seo_description' => 'sometimes|nullable|string',
            'seo_keywords' => 'sometimes|nullable|string',

            // Contact
            'contact_whatsapp' => 'sometimes|nullable|string|max:50',
            'contact_email' => 'sometimes|nullable|email|max:255',
            'contact_phone' => 'sometimes|nullable|string|max:50',

            // Notifications
            'email_notifications' => 'sometimes|boolean',

            // Delivery
            'preferred_delivery_time' => 'sometimes|nullable|string',
            'leave_at_door' => 'sometimes|boolean',
            'signature_required' => 'sometimes|boolean',

            // Other
            'coupon_code' => 'sometimes|nullable|string|max:255',
            'wishlist_public' => 'sometimes|boolean',
            'footer_font_size' => 'sometimes|integer|min:10|max:40',

            // Homepage
            'show_featured_products' => 'sometimes|boolean',
            'show_best_sellers' => 'sometimes|boolean',
            'show_new_arrivals' => 'sometimes|boolean',

            // Payments
            'payment_methods' => 'sometimes|array',

            // Images
            'background_image' => [
                'sometimes',
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'store_logo' => [
                'sometimes',
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'favicon' => [
                'sometimes',
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,webp,ico',
                'max:2048',
            ],
        ];
    }
}