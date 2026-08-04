<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OvertimeRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'ot_date', 'hours', 'rate_multiplier', 'reason', 'status', 'approved_by',
    ];

    protected $casts = ['ot_date' => 'date'];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
