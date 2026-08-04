<?php

namespace Database\Seeders;

use App\Models\PayrollRule;
use Illuminate\Database\Seeder;

class PayrollRuleSeeder extends Seeder
{
    public function run(): void
    {
        $rules = [
            ['category' => 'salary_policy', 'key' => 'increment_cycle', 'value' => ['months' => 12], 'description' => 'Annual increment cycle'],
            ['category' => 'attendance', 'key' => 'late_grace_minutes', 'value' => ['minutes' => 15], 'description' => 'Grace period before marked late'],
            ['category' => 'deduction', 'key' => 'unpaid_leave_deduction', 'value' => ['per_day_pct' => 3.33], 'description' => '% of basic salary deducted per unpaid leave day'],
            ['category' => 'budget', 'key' => 'block_payroll_on_budget_exceed', 'value' => ['enabled' => true], 'description' => 'Block payroll generation if it would exceed ministry budget'],
            ['category' => 'payroll', 'key' => 'generation_lock_day', 'value' => ['day_of_month' => 28], 'description' => 'Day of month payroll locks for the cycle'],
            ['category' => 'notification', 'key' => 'budget_threshold_alert', 'value' => ['enabled' => true], 'description' => 'Notify admins when budget crosses warning threshold'],
        ];

        foreach ($rules as $rule) {
            PayrollRule::updateOrCreate(['category' => $rule['category'], 'key' => $rule['key']], $rule);
        }
    }
}
