<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * List users (with search + pagination)
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = User::when($search, function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        })
            ->when($request->role, function ($q) use ($request) {
                $q->where('role', $request->role);
            })
            ->latest()
            ->paginate(10);

        return response()->json($users);
    }

    /**
     * Store new user
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => ['required', Rule::in(['client', 'seller', 'admin'])],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);
if($data['role'] === 'seller') {
            $user->seller()->create([
                'shop_name' => $request->input('store_name', ''),
                'phone' => $request->input('phone', ''),
                'slug' => Str::slug($request->input('store_name', '')),
            ]);
        }
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Show single user
     */
    public function show(Request $request, User $user)
    {
        $authUser = $request->user();
        if ($authUser->role !== 'admin' && $authUser->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($user);
    }

    /**
     * Update user
     */
    public function updateProfile(Request $request, $id)
    {
        $authUser = $request->user();
        if ($authUser->role !== 'admin' && (string) $authUser->id !== $id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }


        $request->validate([
            'profile_image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = User::findOrFail($id);
        // Delete old image if it exists
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $path = $request->file('profile_image')->store('profile_images', 'public');

        $user->update([
            'profile_image' => $path,
        ]);

        return response()->json([
            'message' => 'Profile image updated successfully',
            'user' => $user->fresh(),
        ]);
    }

    public function updateProfileData(Request $request)

    {
        $user = $request->user();
        // if (
        //     $request->user()->role !== 'admin' &&
        //     $request->user()->id !== $targetUser->id
        // ) {
        //     abort(403);
        // }
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|min:6|confirmed',

            'profile_image' => 'nullable|image|max:2048',
        ]);
        // Only admin can update role and status
        if ($user->role === 'admin') {
            $rules['role'] = [
                'required',
                Rule::in(['client', 'seller', 'admin']),
            ];

            $rules['status'] = [
                'required',
                Rule::in(['approved', 'pending', 'rejected']),
            ];
            $data = $request->validate($rules);
        }
        if ($request->hasFile('profile_image')) {

            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }

            $data['profile_image'] = $request
                ->file('profile_image')
                ->store('profile_images', 'public');
        }

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->fresh(),
        ]);
    }
    public function update(Request $request, User $user)
    {
        $authUser = $request->user();

        if ($authUser->role !== 'admin' && $authUser->id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }


        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|min:6',
            'role' => ['required', Rule::in(['client', 'seller', 'admin'])],
            'status' => ['required', Rule::in(['approved', 'pending', 'rejected'])],

        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Delete user
     */
    public function destroy(Request $request)
    {
        $authUser = $request->user();

        if ($authUser->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:users,id',
        ]);

        // Prevent deleting yourself (optional but recommended)
        if ($request->user()) {
            $data['ids'] = array_diff($data['ids'], [$request->user()->id]);
        }

        $deletedCount = User::whereIn('id', $data['ids'])->delete();

        return response()->json([
            'message' => "{$deletedCount} users deleted successfully",
            'deleted_count' => $deletedCount,
        ]);
    }
}
