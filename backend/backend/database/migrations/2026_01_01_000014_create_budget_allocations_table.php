<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ministry_id')->constrained()->cascadeOnDelete();
            $table->string('fiscal_year'); // e.g. "2025-2026"
            $table->enum('funding_source', ['gob_revenue', 'adp', 'special_grant']);
            $table->decimal('allocated_amount', 14, 2);
            $table->decimal('utilized_amount', 14, 2)->default(0);
            $table->unsignedTinyInteger('warning_threshold_pct')->default(80);
            $table->unsignedTinyInteger('critical_threshold_pct')->default(95);
            $table->timestamps();

            $table->unique(['ministry_id', 'fiscal_year', 'funding_source']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_allocations');
    }
};
