<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollItem extends Model
{
    use HasFactory;

    protected $fillable = ['payroll_record_id', 'type', 'label', 'amount'];

    public function payrollRecord(): BelongsTo
    {
        return $this->belongsTo(PayrollRecord::class);
    }
}
