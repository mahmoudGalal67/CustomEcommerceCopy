<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $fillable = ['data'];

    protected $casts = [
        'data' => 'array',
    ];

    public static function defaults(): array
    {
        return [
            'website_name' => 'Store Name',

            // Pages
            'show_contact_page' => true,
            'show_about_page' => true,
            'show_terms_page' => true,
            'show_privacy_page' => true,

            // Addresses
            'default_shipping_address' => '',
            'default_billing_address' => '',
            'address_label' => 'Home',

            // Notifications
            'email_notifications' => true,

            // Localization
            'languages' => ['en'],
            'currency' => 'USD',

            // Delivery
            'preferred_delivery_time' => '',
            'leave_at_door' => false,
            'signature_required' => false,

            // Contact
            'contact_email' => '',
            'contact_phone' => '',
            'contact_whatsapp' => '',

            // Other settings
            'coupon_code' => '',
            'wishlist_public' => false,
            'footer_font_size' => 14,

            // Appearance
            'background_image' => '',
            'store_logo' => '',
            'favicon' => '',

            // SEO
            'seo_title' => '',
            'seo_description' => '',
            'seo_keywords' => '',

            // Homepage
            'show_featured_products' => true,
            'show_best_sellers' => true,
            'show_new_arrivals' => true,

            // Payments
            'payment_methods' => [],
        ];
    }
}