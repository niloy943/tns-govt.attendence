<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OvertimeRecord;
use Illuminate\Http\Request;

class OvertimeController extends Controller
{
    /** Ministry-wide OT duty log. */
    public function index(Request $request)
    {
        $user = $request->user();

        $records = OvertimeRecord::with('employee:id,name,employee_code,ministry_id')
            ->when($user->isEmployee(), fn ($q) => $q->where('employee_id', $user->employee_id))
            ->when($user->isMinistryAdmin(), fn ($q) => $q->whereHas(
                'employee', fn ($e) => $e->where('ministry_id', $user->ministry_id)
            ))
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->query('date_from'), fn ($q, $d) => $q->whereDate('ot_date', '>=', $d))
            ->when($request->query('date_to'), fn ($q, $d) => $q->whereDate('ot_date', '<=', $d))
            ->latest('ot_date')
            ->paginate($request->integer('per_page', 30));

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'ot_date' => ['required', 'date'],
            'hours' => ['required', 'numeric', 'min:0.5', 'max:24'],
            'rate_multiplier' => ['nullable', 'numeric', 'min:1'],
            'reason' => ['nullable', 'string'],
        ]);

        return response()->json(OvertimeRecord::create($data), 201);
    }

    public function review(Request $request, OvertimeRecord $overtimeRecord)
    {
        $data = $request->validate(['status' => ['required', 'in:approved,rejected']]);

        $overtimeRecord->update([...$data, 'approved_by' => $request->user()->id]);

        return response()->json($overtimeRecord);
    }
}
