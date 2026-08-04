<?php

namespace Database\Seeders;

use App\Models\BudgetAllocation;
use App\Models\Ministry;
use Illuminate\Database\Seeder;

class BudgetAllocationSeeder extends Seeder
{
    public function run(): void
    {
        $ministries = Ministry::all();

        foreach ($ministries as $ministry) {
            BudgetAllocation::updateOrCreate(
                [
                    'ministry_id' => $ministry->id,
                    'fiscal_year' => '2025-2026',
                ],
                [
                    'total_allocation' => 50000000.00,
                    'spent_amount' => 12500000.00,
                    'remaining_amount' => 37500000.00,
                    'payroll_cap' => 35000000.00,
                ]
            );
        }
    }
}
