<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Standard Laravel notifications table (Notification facade / database channel)
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('channel'); // in_app, email
            $table->string('event_key'); // leave_request_submitted, attendance_locked, budget_threshold, ...
            $table->boolean('enabled')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'channel', 'event_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
        Schema::dropIfExists('notifications');
    }
};
