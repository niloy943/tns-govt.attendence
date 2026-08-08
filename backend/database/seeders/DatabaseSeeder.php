<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            MinistrySeeder::class,
            UserSeeder::class,
            EmployeeSeeder::class,
            MowcaOfficersSeeder::class,
            MswOfficersSeeder::class,
            OfficerToEmployeeSeeder::class,
            LeaveTypeSeeder::class,
            PayrollRuleSeeder::class,
            BudgetAllocationSeeder::class,
            SettingSeeder::class,
            AttendanceSeeder::class,
        ]);
    }
}
