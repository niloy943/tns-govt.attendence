<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BudgetAllocation;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    /** Budget allocation vs utilization gauge, per ministry/fiscal year/funding source. */
    public function index(Request $request)
    {
        $user = $request->user();

        $allocations = BudgetAllocation::with('ministry:id,name')
            ->when(! $user->isSuperAdmin(), fn ($q) => $q->where('ministry_id', $user->ministry_id))
            ->when($request->query('fiscal_year'), fn ($q, $fy) => $q->where('fiscal_year', $fy))
            ->when($request->query('funding_source'), fn ($q, $s) => $q->where('funding_source', $s))
            ->get()
            ->map(fn (BudgetAllocation $a) => [
                ...$a->toArray(),
                'utilization_pct' => $a->utilization_pct,
                'status_level' => $a->status_level, // normal | warning | critical
            ]);

        return response()->json($allocations);
    }

    public function store(Request $request)
    {
        $this->authorize('create', \App\Models\Ministry::class); // super admin only

        $data = $request->validate([
            'ministry_id' => ['required', 'exists:ministries,id'],
            'fiscal_year' => ['required', 'string', 'max:20'],
            'funding_source' => ['required', 'in:gob_revenue,adp,special_grant'],
            'allocated_amount' => ['required', 'numeric', 'min:0'],
            'warning_threshold_pct' => ['nullable', 'integer', 'min:1', 'max:100'],
            'critical_threshold_pct' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $allocation = BudgetAllocation::updateOrCreate(
            array_intersect_key($data, array_flip(['ministry_id', 'fiscal_year', 'funding_source'])),
            $data
        );

        return response()->json($allocation, 201);
    }

    public function update(Request $request, BudgetAllocation $budgetAllocation)
    {
        $this->authorize('create', \App\Models\Ministry::class);

        $data = $request->validate([
            'allocated_amount' => ['sometimes', 'numeric', 'min:0'],
            'warning_threshold_pct' => ['nullable', 'integer', 'min:1', 'max:100'],
            'critical_threshold_pct' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $budgetAllocation->update($data);

        return response()->json($budgetAllocation);
    }
}
