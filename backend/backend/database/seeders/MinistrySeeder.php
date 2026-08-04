<?php

namespace Database\Seeders;

use App\Models\Ministry;
use Illuminate\Database\Seeder;

class MinistrySeeder extends Seeder
{
    public function run(): void
    {
        $ministries = [
            ['code' => 'MOF', 'name' => 'Ministry of Finance', 'type' => 'Ministry', 'city' => 'Dhaka', 'head_of_office' => 'Secretary, Finance Division'],
            ['code' => 'MOHA', 'name' => 'Ministry of Home Affairs', 'type' => 'Ministry', 'city' => 'Dhaka', 'head_of_office' => 'Home Secretary'],
            ['code' => 'MOE', 'name' => 'Ministry of Education', 'type' => 'Ministry', 'city' => 'Dhaka', 'head_of_office' => 'Secretary, Education'],
            ['code' => 'MOH', 'name' => 'Ministry of Health', 'type' => 'Ministry', 'city' => 'Dhaka', 'head_of_office' => 'Secretary, Health Services'],
        ];

        foreach ($ministries as $m) {
            Ministry::updateOrCreate(['code' => $m['code']], [...$m, 'status' => 'active']);
        }
    }
}
