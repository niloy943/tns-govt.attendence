<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ministry extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code', 'name', 'type', 'city', 'head_of_office',
        'contact_email', 'contact_phone', 'status',
    ];

    public function departmentWings(): HasMany
    {
        return $this->hasMany(DepartmentWing::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function budgetAllocations(): HasMany
    {
        return $this->hasMany(BudgetAllocation::class);
    }

    public function attendanceDevices(): HasMany
    {
        return $this->hasMany(AttendanceDevice::class);
    }
}
