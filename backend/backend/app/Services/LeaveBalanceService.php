<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class LeaveBalanceService
{
    /** Days already approved/pending for this employee+type in the calendar year of $start. */
    public function usedDays(Employee $employee, LeaveType $leaveType, Carbon $start): float
    {
        return (float) LeaveRequest::where('employee_id', $employee->id)
            ->where('leave_type_id', $leaveType->id)
            ->whereIn('status', ['pending', 'approved'])
            ->whereYear('start_date', $start->year)
            ->sum('days_count');
    }

    public function remainingDays(Employee $employee, LeaveType $leaveType, Carbon $start): float
    {
        return max(0, $leaveType->yearly_cap - $this->usedDays($employee, $leaveType, $start));
    }

    /**
     * Throws a validation error if the requested range would exceed the yearly cap.
     */
    public function assertWithinCap(Employee $employee, LeaveType $leaveType, Carbon $start, Carbon $end): float
    {
        $days = $start->diffInDays($end) + 1; // inclusive calendar-day count

        $remaining = $this->remainingDays($employee, $leaveType, $start);

        if ($days > $remaining) {
            throw ValidationException::withMessages([
                'days_count' => "This request needs {$days} day(s) but only {$remaining} day(s) remain of the {$leaveType->name} quota ({$leaveType->yearly_cap}/year).",
            ]);
        }

        return $days;
    }
}
