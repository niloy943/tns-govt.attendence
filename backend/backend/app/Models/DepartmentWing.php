<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DepartmentWing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['ministry_id', 'code', 'name', 'head_of_wing'];

    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
