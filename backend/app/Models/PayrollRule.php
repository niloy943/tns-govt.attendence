<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollRule extends Model
{
    use HasFactory;

    protected $fillable = ['category', 'key', 'value', 'description'];

    protected $casts = ['value' => 'array'];
}
