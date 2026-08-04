<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\PayrollRecord;
use App\Services\PayrollService;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function __construct(private PayrollService $payroll) {}

    /** Officer-wise net salary table. */
    public function index(Request $request)
    {
        $user = $request->user();

        $records = PayrollRecord::with('employee:id,name,employee_code,pay_grade')
            ->when(! $user->isSuperAdmin(), fn ($q) => $q->where('ministry_id', $user->ministry_id))
            ->when($user->isEmployee(), fn ($q) => $q->where('employee_id', $user->employee_id))
            ->when($request->query('month'), fn ($q, $m) => $q->where('month', $m))
            ->when($request->query('year'), fn ($q, $y) => $q->where('year', $y))
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->orderByDesc('year')->orderByDesc('month')
            ->paginate($request->integer('per_page', 30));

        return response()->json($records);
    }

    /** Itemized allowance/deduction modal. */
    public function show(PayrollRecord $payrollRecord)
    {
        $this->authorize('view', $payrollRecord);

        return response()->json($payrollRecord->load('items', 'employee:id,name,employee_code'));
    }

    public function generate(Request $request)
    {
        $this->authorize('generate', PayrollRecord::class);

        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'year' => ['required', 'integer', 'min:2000'],
            'items' => ['array'],
            'items.*.type' => ['required_with:items', 'in:allowance,deduction'],
            'items.*.label' => ['required_with:items', 'string', 'max:100'],
            'items.*.amount' => ['required_with:items', 'numeric', 'min:0'],
        ]);

        $employee = Employee::findOrFail($data['employee_id']);
        $record = $this->payroll->generate($employee, $data['month'], $data['year'], $data['items'] ?? []);

        return response()->json($record, 201);
    }

    public function lock(PayrollRecord $payrollRecord)
    {
        $this->authorize('lock', PayrollRecord::class);

        return response()->json($this->payroll->lock($payrollRecord));
    }

    /** Department salary distribution + payroll trend chart data. */
    public function distribution(Request $request)
    {
        $data = $request->validate(['ministry_id' => ['required', 'exists:ministries,id']]);

        $byWing = PayrollRecord::query()
            ->join('employees', 'employees.id', '=', 'payroll_records.employee_id')
            ->where('payroll_records.ministry_id', $data['ministry_id'])
            ->selectRaw('employees.department_wing_id, sum(net_salary) as total_net_salary, count(*) as employee_count')
            ->groupBy('employees.department_wing_id')
            ->get();

        $trend = PayrollRecord::where('ministry_id', $data['ministry_id'])
            ->selectRaw('year, month, sum(net_salary) as total_net_salary')
            ->groupBy('year', 'month')
            ->orderBy('year')->orderBy('month')
            ->limit(12)
            ->get();

        return response()->json(['by_department_wing' => $byWing, 'trend' => $trend]);
    }
}
