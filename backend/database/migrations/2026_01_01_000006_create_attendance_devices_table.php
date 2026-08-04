<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_devices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['id_card', 'fingerprint', 'face_recognition', 'qr']);
            $table->foreignId('ministry_id')->constrained()->cascadeOnDelete();
            $table->string('location')->nullable();
            $table->string('serial_number')->nullable()->unique();
            $table->enum('status', ['online', 'offline', 'maintenance'])->default('online');
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_devices');
    }
};
