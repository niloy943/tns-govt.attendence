<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'yearly_cap', 'requires_attachment'];

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }
}
