<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mowca_officers', function (Blueprint $table) {
            $table->id();
            $table->integer('overall_sl')->nullable();
            $table->string('department')->nullable();
            $table->integer('sl')->nullable();
            $table->string('name')->nullable();
            $table->string('officer_id')->nullable();
            $table->string('designation')->nullable();
            $table->string('office')->nullable();
            $table->string('email')->nullable();
            $table->string('phone_office')->nullable();
            $table->string('mobile')->nullable();
            $table->string('intercom')->nullable();
            $table->string('room_no')->nullable();
            $table->string('fax')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mowca_officers');
    }
};
