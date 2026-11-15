<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\WishlistItem;
use App\Services\WishlistService;
use App\Services\TokenService;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function __construct(
        public WishlistService $wishlistService,
        public TokenService $tokenService
    ) {}
    // 🧩 Get current  wishlist
    public function index(Request $request)
    {
        $user = $this->tokenService->getUserFromRefreshCookie($request);
        if ($user) {
            $wishlist = $this->wishlistService->findOrCreateUserWishlist($user->id);
            return $this->responseWishlist($wishlist);
        } else {
            [$wishlist, $token] = $this->wishlistService->findOrCreateGuestWishlist($request);
            return $this->responseWishlist($wishlist)->cookie("guest_token", $token, 43200, "/");
        }
    }

    // 🧩 Add item to wishlist
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'nullable|exists:products,id',
        ]);
        if (empty($validated['product_id'])) {
            return response()->json([
                'message' => 'Product ID is required.'
            ], 422);
        }
        $user = $this->tokenService->getUserFromRefreshCookie($request);
        if ($user) {
            $wishlist = $this->wishlistService->findOrCreateUserWishlist($user->id);
            $item = $this->deleteorcreateitem($validated, $wishlist);
            $response = response()->json(["item" => $item, "message" => "Added to wishlist"]);
            return $response;
        } else {
            // Create new item
            [$wishlist, $guestToken] = $this->wishlistService->findOrCreateGuestWishlist($request);
            $item = $this->deleteorcreateitem($validated, $wishlist);

            $response = response()->json(["item" => $item, "message" => $guestToken]);
            $response->cookie("guest_token", $guestToken, 43200, "/");
            return $response;
        }
    }

    // 🧩 Remove item
    public function destroy(Request $request, $id)
    {
        $user = $this->tokenService->getUserFromRefreshCookie($request);
        if ($user) {
            $wishlist = $this->wishlistService->findOrCreateUserWishlist($user->id);
        } else {
            [$wishlist, $guestToken] = $this->wishlistService->findOrCreateGuestWishlist($request);
        }
        $item = WishlistItem::where('wishlist_id', $wishlist->id)->findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Item removed']);
    }

    public function clear(Request $request)
    {
        $wishlist = $this->wishlistService->findOrCreateUserWishlist($request->user()->id);
        $wishlist->items()->delete();

        return response()->json(["message" => "Wishlist cleared"]);
    }
    // 🧩 Sync guest wishlist
    public function merge(Request $request)
    {
        $guestToken = $request->cookie("guest_token");

        if (!$guestToken)
            return response()->json(["message" => "No guest wishlist"], 200);

        $guest = Wishlist::where("guest_token", $guestToken)->first();



        $userWishlist = $this->wishlistService->findOrCreateUserWishlist($request->user()->id);

        $this->wishlistService->mergeWishlists($guest, $userWishlist);

        return response()->json(["message" => "Wishlist merged"])
            ->cookie("guest_token", null, -1);
    }
    public function deleteorcreateitem(array $validated, Wishlist $wishlist)
    {
        $item = $wishlist->items()
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($item) {
            $item->delete();

            return [
                'item' => null,
                'action' => 'removed',
                'message' => 'Removed from wishlist',
            ];
        }

        $item = $wishlist->items()->create([
            'product_id' => $validated['product_id'],
        ]);

        return [
            'item' => $item->load('product.translations'),
            'action' => 'added',
            'message' => 'Added to wishlist',
        ];
    }
    private function responseWishlist($wishlist)
    {
        return response()->json([
            "items" => $wishlist->items()->with(['product.translations', 'product.variants', 'product.variants.images'])->get()
        ]);
    }
}
