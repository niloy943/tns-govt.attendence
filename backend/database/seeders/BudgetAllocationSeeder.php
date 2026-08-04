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
                    'funding_source' => 'gob_revenue',
                ],
                [
                    'allocated_amount' => 50000000.00,
                    'utilized_amount' => 12500000.00,
                    'warning_threshold_pct' => 90,
                    'critical_threshold_pct' => 100,
                ]
            );
        }
    }
}
