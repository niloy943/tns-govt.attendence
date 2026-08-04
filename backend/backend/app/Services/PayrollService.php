<?php

namespace App\Services;

use App\Models\BudgetAllocation;
use App\Models\Employee;
use App\Models\PayrollRecord;
use App\Models\PayrollRule;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PayrollService
{
    /**
     * Generate (or regenerate, while draft) a payroll record for one employee/month/year,
     * applying allowance/deduction rules and blocking generation if it would breach budget.
     *
     * @param  array<int, array{type: 'allowance'|'deduction', label: string, amount: float}>  $items
     */
    public function generate(Employee $employee, int $month, int $year, array $items = []): PayrollRecord
    {
        $blockOnBudgetExceed = PayrollRule::where('category', 'budget')
            ->where('key', 'block_payroll_on_budget_exceed')
            ->value('value');
        $blockOnBudgetExceed = $blockOnBudgetExceed['enabled'] ?? true;

        return DB::transaction(function () use ($employee, $month, $year, $items, $blockOnBudgetExceed) {
            $allowances = collect($items)->where('type', 'allowance')->sum('amount');
            $deductions = collect($items)->where('type', 'deduction')->sum('amount');
            $net = (float) $employee->basic_salary + $allowances - $deductions;

            if ($blockOnBudgetExceed) {
                $this->assertWithinBudget($employee, $net);
            }

            /** @var PayrollRecord $record */
            $record = PayrollRecord::updateOrCreate(
                ['employee_id' => $employee->id, 'month' => $month, 'year' => $year],
                [
                    'ministry_id' => $employee->ministry_id,
                    'basic_salary' => $employee->basic_salary,
                    'gross_allowances' => $allowances,
                    'gross_deductions' => $deductions,
                    'net_salary' => $net,
                    'status' => 'generated',
                    'generated_at' => now(),
                ]
            );

            $record->items()->delete();
            foreach ($items as $item) {
                $record->items()->create($item);
            }

            $this->applyBudgetUtilization($employee, $net);
            AuditLogger::log($record, 'payroll_generated', [], ['net_salary' => $net]);

            return $record->load('items');
        });
    }

    public function lock(PayrollRecord $record): PayrollRecord
    {
        $record->update(['status' => 'locked', 'locked_at' => now()]);
        AuditLogger::log($record, 'payroll_locked');

        return $record;
    }

    private function assertWithinBudget(Employee $employee, float $additionalNet): void
    {
        $allocation = BudgetAllocation::where('ministry_id', $employee->ministry_id)
            ->where('fiscal_year', $this->currentFiscalYear())
            ->orderByDesc('id')
            ->first();

        if (! $allocation) {
            return; // no allocation configured yet — nothing to block against
        }

        $projected = (float) $allocation->utilized_amount + $additionalNet;

        if ($projected > (float) $allocation->allocated_amount) {
            throw ValidationException::withMessages([
                'budget' => 'Generating this payroll would exceed the ministry\'s allocated budget for '
                    .$this->currentFiscalYear().'. Adjust the allocation or salary items before proceeding.',
            ]);
        }
    }

    private function applyBudgetUtilization(Employee $employee, float $net): void
    {
        BudgetAllocation::where('ministry_id', $employee->ministry_id)
            ->where('fiscal_year', $this->currentFiscalYear())
            ->orderByDesc('id')
            ->first()
            ?->increment('utilized_amount', $net);
    }

    private function currentFiscalYear(): string
    {
        // Bangladesh-style fiscal year: July–June
        $now = now();

        return $now->month >= 7
            ? $now->year.'-'.($now->year + 1)
            : ($now->year - 1).'-'.$now->year;
    }
}
