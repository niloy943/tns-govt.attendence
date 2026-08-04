<?php

namespace Database\Seeders;

use App\Models\Ministry;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'superadmin@tns.gov.bd'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );

        $mof = Ministry::where('code', 'MOF')->first();

        if ($mof) {
            User::updateOrCreate(
                ['email' => 'admin.mof@tns.gov.bd'],
                [
                    'name' => 'MOF Ministry Admin',
                    'password' => Hash::make('password'),
                    'role' => 'ministry_admin',
                    'ministry_id' => $mof->id,
                    'status' => 'active',
                ]
            );
        }
    }
}
