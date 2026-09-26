<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('site_name');
            $table->string('site_description')->nullable();
            $table->string('site_contact_phone')->default('000-000-0000');
            $table->string('site_contact_email')->default('contact@yoursite.com');
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();


            $table->json('info')->nullable();
            $table->json('terms')->nullable();
            $table->json('privacy')->nullable();

            $table->json('colors')->nullable();
            $table->json('socials')->nullable(); // ⬅ array of objects


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
