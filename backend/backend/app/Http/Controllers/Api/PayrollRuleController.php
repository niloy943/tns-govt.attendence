<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PayrollRule;
use Illuminate\Http\Request;

class PayrollRuleController extends Controller
{
    /** The 6 configurable rule cards: Salary Policy, Attendance, Deduction, Budget, Payroll, Notification. */
    public function index(Request $request)
    {
        $rules = PayrollRule::query()
            ->when($request->query('category'), fn ($q, $c) => $q->where('category', $c))
            ->get()
            ->groupBy('category');

        return response()->json($rules);
    }

    public function update(Request $request, PayrollRule $payrollRule)
    {
        $this->authorize('configureRules', \App\Models\PayrollRecord::class);

        $data = $request->validate(['value' => ['required']]);
        $payrollRule->update(['value' => $data['value']]);

        return response()->json($payrollRule);
    }
}
