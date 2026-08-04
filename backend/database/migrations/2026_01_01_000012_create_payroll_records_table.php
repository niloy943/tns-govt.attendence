<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ministry_id')->constrained();
            $table->unsignedTinyInteger('month');
            $table->unsignedSmallInteger('year');
            $table->decimal('basic_salary', 12, 2);
            $table->decimal('gross_allowances', 12, 2)->default(0);
            $table->decimal('gross_deductions', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2)->default(0);
            $table->enum('status', ['draft', 'generated', 'locked', 'paid'])->default('draft');
            $table->timestamp('generated_at')->nullable();
            $table->timestamp('locked_at')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'month', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_records');
    }
};
