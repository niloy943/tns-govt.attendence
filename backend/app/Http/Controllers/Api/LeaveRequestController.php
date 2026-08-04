<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Services\LeaveBalanceService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    public function __construct(private LeaveBalanceService $balances) {}

    public function index(Request $request)
    {
        $user = $request->user();

        $requests = LeaveRequest::with(['employee:id,name,employee_code,ministry_id', 'leaveType'])
            ->when($user->isEmployee(), fn ($q) => $q->where('employee_id', $user->employee_id))
            ->when($user->isMinistryAdmin(), fn ($q) => $q->whereHas(
                'employee', fn ($e) => $e->where('ministry_id', $user->ministry_id)
            ))
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->query('leave_type_id'), fn ($q, $id) => $q->where('leave_type_id', $id))
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return response()->json($requests);
    }

    /** Apply tab. */
    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'leave_type_id' => ['required', 'exists:leave_types,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string'],
            'attachment_path' => ['nullable', 'string'],
        ]);

        $employee = Employee::findOrFail($data['employee_id']);
        $leaveType = LeaveType::findOrFail($data['leave_type_id']);

        if ($leaveType->requires_attachment && empty($data['attachment_path'])) {
            return response()->json([
                'message' => "{$leaveType->name} leave requires a supporting attachment.",
                'errors' => ['attachment_path' => ['This field is required for '.$leaveType->name.' leave.']],
            ], 422);
        }

        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);
        $days = $this->balances->assertWithinCap($employee, $leaveType, $start, $end);

        $leaveRequest = LeaveRequest::create([
            ...$data,
            'days_count' => $days,
            'status' => 'pending',
        ]);

        return response()->json($leaveRequest->load('leaveType'), 201);
    }

    /** History/Approvals tab action. */
    public function review(Request $request, LeaveRequest $leaveRequest)
    {
        $data = $request->validate([
            'status' => ['required', 'in:approved,rejected'],
            'review_note' => ['nullable', 'string'],
        ]);

        $leaveRequest->update([
            ...$data,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json($leaveRequest);
    }

    public function cancel(Request $request, LeaveRequest $leaveRequest)
    {
        $leaveRequest->update(['status' => 'cancelled']);

        return response()->json($leaveRequest);
    }

    /** Balance summary for an employee across all leave types, for the current year. */
    public function balance(Request $request, int $employeeId)
    {
        $employee = Employee::findOrFail($employeeId);
        $year = $request->integer('year', now()->year);
        $asOf = Carbon::create($year, 1, 1);

        $balance = LeaveType::all()->map(fn (LeaveType $type) => [
            'leave_type' => $type->name,
            'yearly_cap' => $type->yearly_cap,
            'used' => $this->balances->usedDays($employee, $type, $asOf),
            'remaining' => $this->balances->remainingDays($employee, $type, $asOf),
        ]);

        return response()->json($balance);
    }
}
