<?php

use App\Http\Controllers\AnnouncementBarController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\PopupCampaignController;
use App\Http\Controllers\SettingController;
use App\Services\KnowledgeBaseService;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\n8nDailyReportController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Http;
/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::post('/logout', [AuthController::class, 'logout']);


/*
|--------------------------------------------------------------------------
| Public Data (No Auth)
|--------------------------------------------------------------------------
*/

Route::apiResource('colors', ColorController::class)->only(['index']);
Route::apiResource('sizes', SizeController::class)->only(['index']);

Route::get('categories', [CategoryController::class, 'index']);



Route::apiResource('products', ProductController::class)->only(['index', 'show']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Token Required)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth.jwt', 'role:admin'])->group(
    function () {
    Route::delete('categories', [CategoryController::class, 'destroy']);
    Route::get('categories/{id}', [CategoryController::class, 'show']);
Route::post('categories/{id}', [CategoryController::class, 'update']);
Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
    Route::post('categories', [CategoryController::class, 'store']);

    }
);


Route::middleware('auth.jwt')->group(function () {
    Route::get('/products/dashboard/adminSeller', [ProductController::class, 'Dashboardindex']);
    // Authenticated user info
    Route::get('/user', [AuthController::class, 'me']);

    // Admin / CRUD except index
    Route::apiResource('colors', ColorController::class)->except(['index']);
    Route::apiResource('sizes', SizeController::class)->except(['index']);
    Route::delete('products', [ProductController::class, 'destroy']);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    // Cart merge (when user logs in)
    Route::post('/cart/merge', [CartController::class, 'merge']);
});


/*
|--------------------------------------------------------------------------
| Cart Routes (Guest + Auth)
|--------------------------------------------------------------------------
*/

Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);
Route::delete('/cart/{id}', [CartController::class, 'destroy']);
Route::delete('/cart/clear', [CartController::class, 'clear']);
/*
|--------------------------------------------------------------------------
| Wishlist Routes (Guest + Auth)
|--------------------------------------------------------------------------
*/

Route::get('/wishlist', [WishlistController::class, 'index']);
Route::post('/wishlist', [WishlistController::class, 'store']);
Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);
Route::delete('/wishlist/clear', [WishlistController::class, 'clear']);


/*
|--------------------------------------------------------------------------
| Checkout Routes ( Auth)
|--------------------------------------------------------------------------
*/
Route::middleware('auth.jwt')->group(
    function () {
        Route::post('/checkout', [CheckoutController::class, 'checkout']);
    }
);
/*


/*
|--------------------------------------------------------------------------
| Orders Routes ( Auth)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth.jwt'])->group(function () {
    Route::prefix('orders')->group(function () {
    Route::get('/order/{id}', [OrderController::class, 'show']);
    });
});

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);
Route::middleware('auth.jwt')->group(
    function () {
        Route::get('/orders/client', [OrderController::class, 'clientIndex']);
        Route::get('/orders/client/{id}', [CheckoutController::class, 'show']);
        Route::put('/orders/client/{id}', [CheckoutController::class, 'update']);
        Route::delete('/orders/client/{id}', [CheckoutController::class, 'destroy']);

        Route::post('/stripe/payment-intent', [StripeController::class, 'createPaymentIntent']);
    }
);
/*


|--------------------------------------------------------------------------
| Admin Panel Routes (Sanctum + Role)
|--------------------------------------------------------------------------
*/


Route::middleware(['auth.jwt', 'role:admin'])->group(function () {
    Route::prefix('pages')->group(function () {
        Route::post('/', [PageController::class, 'store']);
        Route::put('{id}', [PageController::class, 'update']);
        Route::delete('{slug}', [PageController::class, 'destroy']);
    });
});
Route::prefix('pages')->group(function () {
    Route::get('/', [PageController::class, 'index']);
    Route::get('/pagesLinks', [PageController::class, 'indexLinks']);
    Route::get('{id}', [PageController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| Admin and Sellers Panel Routes (Sanctum + Role)
|--------------------------------------------------------------------------
*/


Route::middleware(['auth.jwt', 'role:admin'])->group(function () {
    Route::prefix('orders')->group(function () {
        Route::get('/all', [OrderController::class, 'Index']);

    });
});

Route::middleware(['auth.jwt', 'role:admin,seller'])->group(function () {
    Route::prefix('orders')->group(function () {
        Route::get('/seller', [OrderController::class, 'sellerIndex']);
        Route::post('/update-status/{id}', [OrderController::class, 'updateStatus']);
        Route::post('/cancel', [OrderController::class, 'cancelOrders']);
        Route::post('/cancel-seller', [OrderController::class, 'cancelSellerOrders']);
    });
});


// Users Manages
Route::middleware(['auth.jwt'])->group(function () {
    Route::apiResource('users', UserController::class);
    Route::delete('users', [UserController::class, 'destroy']);
    Route::POST('users/profile/{id}', [UserController::class, 'updateProfile']);
});
Route::middleware('auth.jwt')->group(
    function () {
        Route::POST('users/profileUpdate', [UserController::class, 'updateProfileData']);
        Route::get('/users/profile', [UserController::class, 'profile']);
    }
);

Route::get('/settings', [SettingController::class, 'show']);
Route::middleware(['auth.jwt', 'role:admin'])->group(function () {
    Route::post('/settings', [SettingController::class, 'update']);
    // HandelImageUpload
    Route::post('/upload-image', [ImageController::class, 'upload']);
    Route::post('/delete-image', [ImageController::class, 'delete']);
    Route::get('/products/all/names', [ProductController::class, 'getAllProductsName']);
    Route::get('/products/all/filterByNames', [ProductController::class, 'filterByNames']);
    Route::post('/products/byCategories', [ProductController::class, 'byCategories']);
});

Route::post('/chat/send', [ChatController::class, 'sendMessage']);
Route::post('/chat/merge', [ChatController::class, 'mergeGuestChat']);
Route::post('/chat/messages', [ChatController::class, 'getMessages']);
Route::post('/chat/markMessageIsread', [ChatController::class, 'markMessageIsread']);
Route::post('/chat/markALLMessagesIsreadForUser', [ChatController::class, 'markALLMessagesIsreadForUser']);
Route::post('/admin/support/markALLMessagesIsreadForAdmin', [ChatController::class, 'markALLMessagesIsreadForAdmin']);
Route::get('/admin/support/unreadStats', [ChatController::class, 'getUnreadStats']);

Route::prefix('admin/support')
    ->middleware(['auth.jwt', 'role:admin'])
    ->group(function () {

        Route::get('/chats', [
            ChatController::class,
            'getChats'
        ]);

        Route::get('/messages/{chatId}', [
            ChatController::class,
            'getMessagesAdmin'
        ]);

        Route::post('/send', [
            ChatController::class,
            'sendMessageAdmin'
        ]);

        Route::post('/resolve/{chatId}', [
            ChatController::class,
            'resolveChat'
        ]);
        Route::post('/closeChat', [
            ChatController::class,
            'closeChat'
        ]);
        Route::post('/openChat', [
            ChatController::class,
            'openChat'
        ]);
    });

Route::apiResource('events', EventController::class);

Route::get(
    '/announcement-bar',
    [AnnouncementBarController::class, 'show']
);

Route::put(
    '/announcement-bar',
    [AnnouncementBarController::class, 'update']
);

Route::get(
    'popup-campaigns',
    [PopupCampaignController::class, 'show']
);

Route::POST(
    '/popup-campaigns',
    [PopupCampaignController::class, 'update']
);

// Route::middleware(['auth.jwt', 'role:admin'])
//     ->prefix('features')
//     ->group(function () {

//         Route::get('/', [FeatureController::class, 'show']);

//         Route::post('/', [FeatureController::class, 'update']);
//     });
Route::prefix('features')
    ->group(function () {

        Route::get('/', [FeatureController::class, 'show']);

        Route::post('/', [FeatureController::class, 'update']);
    });

Route::get('/globalSearch', [SearchController::class, 'index']);


Route::middleware(['auth.jwt', 'role:admin,seller'])->group(function () {
    Route::get('/admin/analytics', [AnalyticsController::class, 'dashboard']);
});
Route::get(
    '/automation/daily-sales-report',
    [n8nDailyReportController::class, 'getN8nDailyReport']
);
Route::post(
    '/contactForm',
    [ContactController::class, 'store']
);

Route::middleware(['auth.jwt', 'role:admin'])->prefix('admin')->group(function () {
    Route::get(
        '/contact-messages',
        [ContactController::class, 'index']
    );

    Route::get(
        '/contact-messages/{contactMessage}',
        [ContactController::class, 'show']
    );

    Route::patch(
        '/contact-messages/{contactMessage}',
        [ContactController::class, 'update']
    );

    Route::delete(
        '/contact-messages/{contactMessage}',
        [ContactController::class, 'destroy']
    );
    Route::post(
    '/contact-messages/{contactMessage}/reply',
    [ContactController::class, 'reply']
);
});

Route::middleware(['auth.jwt', 'role:admin'])->prefix('admin')->group(function () {
         Route::get(
            '/newsletter/subscribers',
            [NewsletterController::class, 'index']
        );

        Route::get(
            '/newsletter/subscribers/{newsletterSubscriber}',
            [NewsletterController::class, 'show']
        );

        Route::patch(
            '/newsletter/subscribers/{newsletterSubscriber}',
            [NewsletterController::class, 'update']
        );

        Route::delete(
            '/newsletter/subscribers/{newsletterSubscriber}',
            [NewsletterController::class, 'destroy']
        );
});
Route::post(
    '/newsletter/subscribe',
    [NewsletterController::class, 'subscribe']
);

Route::post(
    '/newsletter/unsubscribe',
    [NewsletterController::class, 'unsubscribe']
);


// Route::get('/index-company-pdf', function (
//     KnowledgeBaseService $knowledgeBaseService
// ) {

//     $pdfPath = storage_path(
//         'app/company/AboutOurCompany.pdf'
//     );

//     $knowledgeBaseService->indexCompanyPdf(
//         $pdfPath
//     );

//     return 'Company PDF indexed successfully!';
// });
