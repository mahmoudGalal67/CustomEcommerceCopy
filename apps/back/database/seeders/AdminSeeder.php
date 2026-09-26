<?php

namespace Database\Seeders;

use App\Models\Seller;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
          // Create Admin
    $admin = User::updateOrCreate(
        [
            'email' => 'admin@gmail.com',
        ],
        [
            'name' => 'Admin',
            'password' => Hash::make('123456'),
            'role' => 'admin',
            'status' => 'approved',
            'email_verified_at' => now(),
        ]
    );

    // Create Seller Profile
    Seller::updateOrCreate(
        [
            'user_id' => $admin->id,
        ],
        [
            'shop_name' => 'My Awesome Shop',
            'slug' => 'my-awesome-shop',
            'bio' => 'Welcome to my awesome shop!',
            'logo_path' => null,
            'is_active' => true,
        ]
    );
    }
}
