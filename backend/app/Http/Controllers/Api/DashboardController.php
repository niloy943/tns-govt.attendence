<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Models\Ministry;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /** Central mode: government-wide stats + all-ministries table. */
    public function central()
    {
        $stats = [
            'total_ministries' => Ministry::where('status', 'active')->count(),
            'total_employees' => Employee::where('status', 'active')->count(),
            'present_today' => AttendanceRecord::whereDate('attendance_date', today())
                ->whereNotNull('check_in_time')->count(),
            'pending_leave_requests' => \App\Models\LeaveRequest::where('status', 'pending')->count(),
        ];

        $ministries = Ministry::withCount('employees')
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'head_of_office', 'city']);

        return response()->json(['stats' => $stats, 'ministries' => $ministries]);
    }

    /** Ministry mode: department-wise attendance donut + live officer attendance log. */
    public function ministry(Request $request, Ministry $ministry)
    {
        $this->authorize('view', $ministry);

        $byWing = Employee::where('ministry_id', $ministry->id)
            ->join('attendance_records', function ($join) {
                $join->on('attendance_records.employee_id', '=', 'employees.id')
                    ->whereDate('attendance_records.attendance_date', today());
            })
            ->selectRaw('employees.department_wing_id, sum(case when check_in_time is not null then 1 else 0 end) as present, count(*) as total')
            ->groupBy('employees.department_wing_id')
            ->get();

        $liveLog = AttendanceRecord::with('employee:id,name,employee_code,department_wing_id')
            ->whereHas('employee', fn ($q) => $q->where('ministry_id', $ministry->id))
            ->whereDate('attendance_date', today())
            ->latest('check_in_time')
            ->limit(50)
            ->get();

        return response()->json(['by_department_wing' => $byWing, 'live_log' => $liveLog]);
    }
}
