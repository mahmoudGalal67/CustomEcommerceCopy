<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeatureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [
            'show_contact_page' => filter_var(
                $this->input('show_contact_page'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'show_about_page' => filter_var(
                $this->input('show_about_page'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'show_terms_page' => filter_var(
                $this->input('show_terms_page'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'show_privacy_page' => filter_var(
                $this->input('show_privacy_page'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'email_notifications' => filter_var(
                $this->input('email_notifications'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'leave_at_door' => filter_var(
                $this->input('leave_at_door'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'signature_required' => filter_var(
                $this->input('signature_required'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'show_featured_products' => filter_var(
                $this->input('show_featured_products'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'show_best_sellers' => filter_var(
                $this->input('show_best_sellers'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'show_new_arrivals' => filter_var(
                $this->input('show_new_arrivals'),
                FILTER_VALIDATE_BOOLEAN
            ),

            'languages' => $this->input('languages', []),

            'payment_methods' => json_decode(
                $this->input('payment_methods', '[]'),
                true
            ),
        ];

        $this->merge($data);

        /*
        |--------------------------------------------------------------------------
        | Remove empty image values
        |--------------------------------------------------------------------------
        |
        | FormData may send null as the string "null".
        | We don't want Laravel to validate that as an image.
        |
        */

        foreach ([
            'background_image',
            'store_logo',
            'favicon',
        ] as $field) {
            $value = $this->input($field);

            if (
                $value === null ||
                $value === '' ||
                $value === 'null' ||
                $value === 'undefined'
            ) {
                $this->request->remove($field);
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'website_name' => [
                'nullable',
                'string',
            ],

            'show_contact_page' => [
                'boolean',
            ],

            'show_about_page' => [
                'boolean',
            ],

            'show_terms_page' => [
                'boolean',
            ],

            'show_privacy_page' => [
                'boolean',
            ],

            'languages' => [
                'nullable',
                'array',
            ],

            'languages.*' => [
                'string',
            ],

            'currency' => [
                'string',
            ],

            'address_label' => [
                'string',
            ],

            'default_billing_address' => [
                'nullable',
                'string',
            ],

            'default_shipping_address' => [
                'nullable',
                'string',
            ],

            'seo_title' => [
                'string',
            ],

            'seo_description' => [
                'string',
            ],

            'seo_keywords' => [
                'string',
            ],

            'contact_whatsapp' => [
                'string',
            ],

            'email_notifications' => [
                'boolean',
            ],

            'wishlist_public' => [
                'boolean',
            ],

            'preferred_delivery_time' => [
                'nullable',
                'string',
            ],

            'leave_at_door' => [
                'boolean',
            ],

            'signature_required' => [
                'boolean',
            ],

            'contact_email' => [
                'nullable',
                'email',
            ],

            'contact_phone' => [
                'nullable',
                'string',
            ],

            'coupon_code' => [
                'nullable',
                'string',
            ],

            'footer_font_size' => [
                'integer',
            ],

            'payment_methods' => [
                'array',
            ],

            'show_featured_products' => [
                'boolean',
            ],

            'show_best_sellers' => [
                'boolean',
            ],

            'show_new_arrivals' => [
                'boolean',
            ],

            /*
            |--------------------------------------------------------------------------
            | Images
            |--------------------------------------------------------------------------
            */

            'background_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'store_logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'favicon' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,ico',
                'max:5120',
            ],
        ];
    }
}