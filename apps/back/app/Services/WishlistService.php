<?php

namespace App\Services;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WishlistService
{
 public function findOrCreateGuestWishlist(Request $request)
 {
  $token = $request->cookie("guest_token");

  if (!$token) {
   $token = Str::uuid();
  }

  $wishlist = Wishlist::firstOrCreate([
   "guest_token" => $token
  ]);

  return [$wishlist, $token];
 }

 public function findOrCreateUserWishlist($userId)
 {
  return Wishlist::firstOrCreate([
   "user_id" => $userId
  ]);
 }

 public function mergeWishlists(Wishlist $guest, Wishlist $user)
 {
  foreach ($guest->items as $item) {

   $existing = $user->items()->where("product_id", $item->product_id)->first();

   if ($existing) {
    $item->delete();
   } else {
    $item->update(["wishlist_id" => $user->id]);
   }
  }

  $guest->delete();
 }
}
