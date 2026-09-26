<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        Page::updateOrCreate(
            ['slug' => 'home'],
            [
                'title' => [
                    'en' => 'Home',
                    'ar' => 'الرئيسية',
                ],

                'sections' => [
                    // -------------------------------------------------
                    // HERO 2
                    // -------------------------------------------------
                    [
                        'id' => (string) Str::uuid(),
                        'type' => 'hero2',
                        'props' => [
                            'badge' => [
                                'en' => 'New Season Drop — 24 styles just landed',
                                'ar' => 'وصلت تشكيلة الموسم الجديد — 24 تصميمًا جديدًا',
                            ],

                            'titleLine1' => [
                                'en' => 'Step Into',
                                'ar' => 'خطوتك نحو',
                            ],

                            'titleHighlight' => [
                                'en' => 'Greatness',
                                'ar' => 'العظمة',
                            ],

                            'titleLine3' => [
                                'en' => 'Every Day.',
                                'ar' => 'كل يوم.',
                            ],

                            'description' => [
                                'en' => 'Authentic premium sneakers from Nike, Jordan, Adidas, Yeezy and more. Verified legit, shipped fast, styled for the streets.',
                                'ar' => 'أحذية رياضية أصلية وفاخرة من Nike وJordan وAdidas وYeezy وغيرها. منتجات أصلية موثقة، شحن سريع، وأناقة تناسب الشوارع.',
                            ],

                            'primaryButton' => [
                                'text' => [
                                    'en' => 'Shop The Drop',
                                    'ar' => 'تسوق المجموعة الجديدة',
                                ],
                                'href' => '#products',
                            ],

                            'secondaryButton' => [
                                'text' => [
                                    'en' => 'Explore Brands',
                                    'ar' => 'استكشف العلامات التجارية',
                                ],
                                'href' => '#brands',
                            ],

                            'stats' => [
                                [
                                    'id' => (string) Str::uuid(),
                                    'value' => [
                                        'en' => '500+',
                                        'ar' => '500+',
                                    ],
                                    'label' => [
                                        'en' => 'Premium Styles',
                                        'ar' => 'تصميم فاخر',
                                    ],
                                ],
                                [
                                    'id' => (string) Str::uuid(),
                                    'value' => [
                                        'en' => '12',
                                        'ar' => '12',
                                    ],
                                    'label' => [
                                        'en' => 'Top Brands',
                                        'ar' => 'علامة تجارية',
                                    ],
                                ],
                                [
                                    'id' => (string) Str::uuid(),
                                    'value' => [
                                        'en' => '4.9★',
                                        'ar' => '4.9★',
                                    ],
                                    'label' => [
                                        'en' => '50k+ Reviews',
                                        'ar' => 'أكثر من 50 ألف تقييم',
                                    ],
                                ],
                            ],

                            'featuredProduct' => [
                                'id' => (string) Str::uuid(),

                                'badge' => [
                                    'en' => 'Featured',
                                    'ar' => 'مميز',
                                ],

                                'brand' => [
                                    'en' => 'Air Jordan 1',
                                    'ar' => 'إير جوردان 1',
                                ],

                                'name' => [
                                    'en' => 'Retro High Chicago',
                                    'ar' => 'ريترو هاي شيكاغو',
                                ],

                                'price' => [
                                    'en' => '$245',
                                    'ar' => '245$',
                                ],

                                'image' => '',

                                'fallbackText' => [
                                    'en' => 'AJ1',
                                    'ar' => 'AJ1',
                                ],
                            ],

                            'miniProduct' => [
                                'id' => (string) Str::uuid(),

                                'brand' => [
                                    'en' => 'AD',
                                    'ar' => 'AD',
                                ],

                                'name' => [
                                    'en' => 'Ultraboost',
                                    'ar' => 'ألترا بوست',
                                ],

                                'image' => '',
                            ],

                            'reviews' => [
                                'rating' => 5,
                                'text' => [
                                    'en' => '50k+ verified reviews',
                                    'ar' => 'أكثر من 50 ألف تقييم موثق',
                                ],
                            ],

                            'shipping' => [
                                'title' => [
                                    'en' => 'Free Shipping',
                                    'ar' => 'شحن مجاني',
                                ],

                                'value' => [
                                    'en' => 'Over $75',
                                    'ar' => 'للطلبات فوق 75$',
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        );

        // -------------------------------------------------------------
        // ABOUT PAGE
        // -------------------------------------------------------------

        Page::updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => [
                    'en' => 'About Us',
                    'ar' => 'من نحن',
                ],

                'sections' => [
                    [
                        'id' => (string) Str::uuid(),
                        'type' => 'twoColumnRichText',
                        'props' => [
                            'image' => '/images/about-store.jpg',

                            'imageAlt' => [
                                'en' => 'Our store',
                                'ar' => 'متجرنا',
                            ],

                            'imageSide' => 'left',

                            'heading' => [
                                'mainTitle' => [
                                    'en' => 'About Our Store',
                                    'ar' => 'عن متجرنا',
                                ],

                                'title1' => [
                                    'en' => 'Built for people who love',
                                    'ar' => 'صُمم للأشخاص الذين يحبون',
                                ],

                                'title2' => [
                                    'en' => 'great products.',
                                    'ar' => 'المنتجات الرائعة.',
                                ],
                            ],

                            'content' => [
                                'en' => '<h2>Built for people who love great products.</h2><p>Discover carefully selected products designed to make your everyday life better.</p><p>We believe great shopping should be simple, enjoyable, and trustworthy.</p><ul><li>Premium quality products</li><li>Fast and reliable shipping</li><li>Secure checkout</li></ul>',

                                'ar' => '<h2>صُمم للأشخاص الذين يحبون المنتجات الرائعة.</h2><p>اكتشف مجموعة مختارة بعناية من المنتجات المصممة لتجعل حياتك اليومية أفضل.</p><p>نؤمن بأن تجربة التسوق الرائعة يجب أن تكون بسيطة، وممتعة، وموثوقة.</p><ul><li>منتجات عالية الجودة</li><li>شحن سريع وموثوق</li><li>دفع آمن</li></ul>',
                            ],
                        ],
                    ],
                ],
            ]
        );
    }
}