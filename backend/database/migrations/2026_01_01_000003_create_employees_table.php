<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_code')->unique(); // BICS ID / cadre ID
            $table->string('nid')->unique()->nullable();
            $table->string('passport_no')->nullable();
            $table->string('name');
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->json('education')->nullable(); // [{degree, institute, year}, ...]
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->foreignId('ministry_id')->constrained()->restrictOnDelete();
            $table->foreignId('department_wing_id')->nullable()->constrained()->nullOnDelete();
            $table->string('designation')->nullable();
            $table->unsignedInteger('level')->default(1); // hierarchy depth, 1 = top
            $table->foreignId('reports_to')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('pay_grade')->nullable();
            $table->decimal('basic_salary', 12, 2)->default(0);
            $table->date('hire_date')->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended', 'retired'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
