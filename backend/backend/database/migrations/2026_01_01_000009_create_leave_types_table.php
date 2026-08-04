<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Casual, Sick, Earned, Rotational, Medical
            $table->unsignedInteger('yearly_cap'); // days
            $table->boolean('requires_attachment')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_types');
    }
};
