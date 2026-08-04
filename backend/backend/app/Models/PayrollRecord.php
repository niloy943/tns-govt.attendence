<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'ministry_id', 'month', 'year', 'basic_salary',
        'gross_allowances', 'gross_deductions', 'net_salary',
        'status', 'generated_at', 'locked_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'locked_at' => 'datetime',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PayrollItem::class);
    }
}
