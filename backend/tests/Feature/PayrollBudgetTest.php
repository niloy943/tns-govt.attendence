<?php

namespace Tests\Feature;

use App\Models\BudgetAllocation;
use App\Models\Employee;
use App\Models\Ministry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayrollBudgetTest extends TestCase
{
    use RefreshDatabase;

    public function test_payroll_generation_blocked_when_exceeding_budget_cap(): void
    {
        $ministry = Ministry::create(['name' => 'Ministry of Agriculture', 'code' => 'MOA', 'budget_allocation' => 100000]);

        BudgetAllocation::create([
            'ministry_id' => $ministry->id,
            'fiscal_year' => '2025-2026',
            'total_allocation' => 50000.00,
            'spent_amount' => 45000.00,
            'remaining_amount' => 5000.00,
            'payroll_cap' => 5000.00, // Small cap
        ]);

        Employee::create([
            'ministry_id' => $ministry->id,
            'name' => 'Officer One',
            'cadre_id' => 'CAD-AG-01',
            'designation' => 'Director',
            'email' => 'officer@moa.gov.bd',
            'base_salary' => 80000.00, // Exceeds 5000 cap
        ]);

        $admin = User::create([
            'name' => 'MOA Admin',
            'email' => 'admin@moa.gov.bd',
            'password' => bcrypt('password'),
            'role' => 'ministry_admin',
            'ministry_id' => $ministry->id,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/payroll/generate', [
                'ministry_id' => $ministry->id,
                'month' => '2026-01',
            ]);

        $response->assertStatus(422);
        $response->assertJsonFragment(['error' => 'Payroll generation exceeds budget cap allocation']);
    }
}
