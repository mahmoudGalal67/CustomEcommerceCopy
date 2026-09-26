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
        Schema::create('popup_campaigns', function (Blueprint $table) {
            $table->id();
            $table->boolean('enabled')
                ->default(true);

            $table->string('title');

            $table->text('description')
                ->nullable();

            $table->string('image')
                ->nullable();

            $table->string('button_text')
                ->nullable();

            $table->string('button_link')
                ->nullable();

            $table->integer('delay_seconds')
                ->default(5);

            $table->integer('show_once_days')
                ->default(7);

            $table->timestamp('starts_at')
                ->nullable();

            $table->timestamp('ends_at')
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('popup_campaigns');
    }
};
