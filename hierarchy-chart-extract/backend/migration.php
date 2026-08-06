<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Establish the columns and indexes necessary for hierarchy.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_code')->unique(); // BCS ID / Cadre ID
            $table->string('nid')->unique()->nullable();
            $table->string('name');
            $table->string('designation')->nullable();
            
            // Hierarchy Fields:
            // 1. level: depth index (e.g., 1 = top executive / Secretary, 2 = Joint Secretary, etc.)
            $table->unsignedInteger('level')->default(1);
            // 2. reports_to: self-referential foreign key mapping to parent manager id
            $table->foreignId('reports_to')->nullable()->constrained('employees')->nullOnDelete();
            
            $table->foreignId('ministry_id')->constrained()->restrictOnDelete();
            $table->foreignId('department_wing_id')->nullable()->constrained()->nullOnDelete();
            
            $table->string('pay_grade')->nullable();
            $table->decimal('basic_salary', 12, 2)->default(0);
            $table->enum('status', ['active', 'inactive', 'suspended', 'retired'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
