<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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

    /**
     * Parent relationship: Direct supervisor of the officer
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reports_to');
    }

    /**
     * Child relationship: Direct subordinates reporting to this officer
     */
    public function subordinates(): HasMany
    {
        return $this->hasMany(Employee::class, 'reports_to');
    }

    /**
     * Ministry relationship
     */
    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }
}
