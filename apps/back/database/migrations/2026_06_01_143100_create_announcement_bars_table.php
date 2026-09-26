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
        Schema::create('announcement_bars', function (Blueprint $table) {
            $table->id();
            $table->boolean('enabled')->default(false);

            $table->json('message');

            $table->string('link')->nullable();

            $table->string('background_color')
                ->default('#000000');

            $table->string('text_color')
                ->default('#FFFFFF');

            $table->integer('speed')
                ->default(50);

            $table->timestamp('starts_at')->nullable();

            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcement_bars');
    }
};
