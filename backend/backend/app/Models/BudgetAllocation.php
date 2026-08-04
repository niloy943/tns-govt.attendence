<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetAllocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'ministry_id', 'fiscal_year', 'funding_source', 'allocated_amount',
        'utilized_amount', 'warning_threshold_pct', 'critical_threshold_pct',
    ];

    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    public function getUtilizationPctAttribute(): float
    {
        if ((float) $this->allocated_amount <= 0) {
            return 0;
        }

        return round(((float) $this->utilized_amount / (float) $this->allocated_amount) * 100, 2);
    }

    public function getStatusLevelAttribute(): string
    {
        $pct = $this->utilization_pct;

        if ($pct >= $this->critical_threshold_pct) {
            return 'critical';
        }

        if ($pct >= $this->warning_threshold_pct) {
            return 'warning';
        }

        return 'normal';
    }
}
