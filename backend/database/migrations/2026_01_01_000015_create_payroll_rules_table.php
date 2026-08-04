<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_rules', function (Blueprint $table) {
            $table->id();
            $table->enum('category', [
                'salary_policy', 'attendance', 'deduction', 'budget', 'payroll', 'notification',
            ]);
            $table->string('key');
            $table->json('value');
            $table->string('description')->nullable();
            $table->timestamps();

            $table->unique(['category', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_rules');
    }
};
