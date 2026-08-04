<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['group', 'key', 'value'];

    protected $casts = ['value' => 'array'];

    public static function getValue(string $group, string $key, $default = null)
    {
        $row = static::where('group', $group)->where('key', $key)->first();

        return $row ? $row->value : $default;
    }

    public static function setValue(string $group, string $key, $value): self
    {
        return static::updateOrCreate(
            ['group' => $group, 'key' => $key],
            ['value' => $value]
        );
    }
}
