<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_code', 'nid', 'passport_no', 'name', 'date_of_birth', 'gender',
        'education', 'emergency_contact_name', 'emergency_contact_phone',
        'ministry_id', 'department_wing_id', 'designation', 'level', 'reports_to',
        'pay_grade', 'basic_salary', 'hire_date', 'status',
    ];

    protected $casts = [
        'education' => 'array',
        'date_of_birth' => 'date',
        'hire_date' => 'date',
        'basic_salary' => 'decimal:2',
    ];

    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    public function departmentWing(): BelongsTo
    {
        return $this->belongsTo(DepartmentWing::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reports_to');
    }

    public function subordinates(): HasMany
    {
        return $this->hasMany(Employee::class, 'reports_to');
    }

    public function userAccount(): HasOne
    {
        return $this->hasOne(User::class);
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function overtimeRecords(): HasMany
    {
        return $this->hasMany(OvertimeRecord::class);
    }

    public function payrollRecords(): HasMany
    {
        return $this->hasMany(PayrollRecord::class);
    }
}
