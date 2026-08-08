<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MowcaOfficer extends Model
{
    use HasFactory;

    protected $table = 'mowca_officers';

    protected $fillable = [
        'overall_sl',
        'department',
        'sl',
        'name',
        'officer_id',
        'designation',
        'office',
        'email',
        'phone_office',
        'mobile',
        'intercom',
        'room_no',
        'fax',
    ];
}
