<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttendanceDevice extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'type', 'ministry_id', 'location', 'serial_number', 'status', 'last_synced_at',
    ];

    protected $casts = ['last_synced_at' => 'datetime'];

    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'device_id');
    }
}
