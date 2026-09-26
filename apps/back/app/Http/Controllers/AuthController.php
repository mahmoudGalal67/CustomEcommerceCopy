<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\NewSellerRegistration;
use App\Models\RefreshToken;
use App\Models\User;
use App\Services\TokenService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|min:6|confirmed',
            'is_seller' =>
            'required|boolean|',
            'store_name' =>
            'nullable|string|max:255|required_if:is_seller,true',
        ]);
        $isSeller = $data['is_seller'];

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $isSeller
                ? 'seller'
                : 'client',

            'status' => $isSeller
                ? 'pending'
                : 'approved',
        ]);

        if ($isSeller) {
            $user->seller()->create([
                'shop_name' => $data['store_name'],
                'phone' => $data['phone'],
                'slug' => Str::slug($data['store_name']),
            ]);
            Mail::to(
                config('mail.admin_email')
            )->send(
                new NewSellerRegistration($user)
            );
        }
        return response()->json(['userInfo' => $user, 'message' => $isSeller ? 'Seller registered successfully wating for approval' : 'User registered successfully'], 201);
    }
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $access = TokenService::createAccessToken($user);
        $refresh = TokenService::createRefreshToken($user);

        $cookie = cookie(
            'refresh_token',
            $refresh['plain'],
            env('REFRESH_TTL', 1209600) / 60,
            '/',
            null,   // ← IMPORTANT
            false,
            true,
            false,
            'lax'
        );
        return response()->json(['access_token' => $access, 'userInfo' => $user])->withCookie($cookie);
    }
    public function refresh(Request $request)
    {
        $plain = $request->cookie('refresh_token');
        if (!$plain)
            return response()->json(['message' => 'Missing refresh token'], 401);

        $token = RefreshToken::where('token_hash', hash('sha256', $plain))->first();
        if (!$token || Carbon::now()->gt($token->expires_at)) {
            return response()->json(['message' => 'Invalid or expired refresh token'], 401);
        }

        $user = $token->user;
        $access = TokenService::createAccessToken($user);
        return response()->json(['access_token' => $access]);
    }

    public function logout(Request $request)
    {
        $plain = $request->cookie('refresh_token');
        if ($plain) {
            RefreshToken::where('token_hash', hash('sha256', $plain))->delete();
        }

        // force delete the cookie
        $expiredCookie = cookie(
            'refresh_token',
            null,
            -1,
            '/',
            null,   // ← MUST MATCH LOGIN
            false,
            true,
            false,
            'lax'
        );


        return response()
            ->json(['message' => 'Logged out'])
            ->withCookie($expiredCookie);
    }


    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
