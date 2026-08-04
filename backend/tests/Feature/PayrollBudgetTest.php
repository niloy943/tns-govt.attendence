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
        $ministry = Ministry::create(['name' => 'Ministry of Agriculture', 'code' => 'MOA']);

        $fiscalYear = now()->month >= 7
            ? now()->year.'-'.(now()->year + 1)
            : (now()->year - 1).'-'.now()->year;

        BudgetAllocation::create([
            'ministry_id' => $ministry->id,
            'fiscal_year' => $fiscalYear,
            'funding_source' => 'gob_revenue',
            'allocated_amount' => 50000.00,
            'utilized_amount' => 45000.00,
            'warning_threshold_pct' => 90,
            'critical_threshold_pct' => 100,
        ]);

        $employee = Employee::create([
            'ministry_id' => $ministry->id,
            'name' => 'Officer One',
            'employee_code' => 'CAD-AG-01',
            'designation' => 'Director',
            'email' => 'officer@moa.gov.bd',
            'basic_salary' => 80000.00, // Exceeds remaining 5000 budget
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
                'employee_id' => $employee->id,
                'month' => now()->month,
                'year' => now()->year,
                'items' => [],
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['budget']);
    }
}
