<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('department_wings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ministry_id')->constrained()->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->string('head_of_wing')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['ministry_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('department_wings');
    }
};
