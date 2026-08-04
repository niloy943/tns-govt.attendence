<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Services\AttendanceApprovalService;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceRecordController extends Controller
{
    public function __construct(private AttendanceApprovalService $approvals) {}

    /** Daily / List view: filterable by date range, ministry, employee, status, source. */
    public function index(Request $request)
    {
        $user = $request->user();

        $records = AttendanceRecord::with(['employee:id,name,employee_code,ministry_id,department_wing_id', 'device:id,name,type'])
            ->when(! $user->isSuperAdmin() && $user->isMinistryAdmin(), fn ($q) => $q->whereHas(
                'employee', fn ($e) => $e->where('ministry_id', $user->ministry_id)
            ))
            ->when($user->isEmployee(), fn ($q) => $q->where('employee_id', $user->employee_id))
            ->when($request->query('date_from'), fn ($q, $d) => $q->whereDate('attendance_date', '>=', $d))
            ->when($request->query('date_to'), fn ($q, $d) => $q->whereDate('attendance_date', '<=', $d))
            ->when($request->query('employee_id'), fn ($q, $id) => $q->where('employee_id', $id))
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->query('source'), fn ($q, $s) => $q->where('source', $s))
            ->orderByDesc('attendance_date')
            ->paginate($request->integer('per_page', 30));

        return response()->json($records);
    }

    /** Calendar-grid register for one employee/month ("Sheet" view). */
    public function sheet(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'year' => ['required', 'integer', 'min:2000'],
        ]);

        $records = AttendanceRecord::where('employee_id', $data['employee_id'])
            ->whereYear('attendance_date', $data['year'])
            ->whereMonth('attendance_date', $data['month'])
            ->orderBy('attendance_date')
            ->get(['id', 'attendance_date', 'check_in_time', 'check_out_time', 'source', 'status']);

        return response()->json($records);
    }

    /** Monthly Summary: per-employee present/absent/late counts for a ministry + month. */
    public function monthlySummary(Request $request)
    {
        $data = $request->validate([
            'ministry_id' => ['required', 'exists:ministries,id'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'year' => ['required', 'integer', 'min:2000'],
        ]);

        $summary = AttendanceRecord::query()
            ->join('employees', 'employees.id', '=', 'attendance_records.employee_id')
            ->where('employees.ministry_id', $data['ministry_id'])
            ->whereYear('attendance_date', $data['year'])
            ->whereMonth('attendance_date', $data['month'])
            ->select('employees.id as employee_id', 'employees.name')
            ->selectRaw('count(*) as days_recorded')
            ->selectRaw('sum(case when check_in_time is not null then 1 else 0 end) as days_present')
            ->groupBy('employees.id', 'employees.name')
            ->orderBy('employees.name')
            ->get();

        return response()->json($summary);
    }

    public function individual(Request $request, int $employeeId)
    {
        $records = AttendanceRecord::where('employee_id', $employeeId)
            ->when($request->query('date_from'), fn ($q, $d) => $q->whereDate('attendance_date', '>=', $d))
            ->when($request->query('date_to'), fn ($q, $d) => $q->whereDate('attendance_date', '<=', $d))
            ->orderByDesc('attendance_date')
            ->paginate($request->integer('per_page', 30));

        return response()->json($records);
    }

    /** Manual entry / CSV row entry point (source = manual|csv_import|api_sync). */
    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'attendance_date' => ['required', 'date'],
            'check_in_time' => ['nullable', 'date_format:H:i'],
            'check_out_time' => ['nullable', 'date_format:H:i'],
            'source' => ['required', 'in:id_card,fingerprint,face_recognition,qr,manual,csv_import,api_sync'],
            'device_id' => ['nullable', 'exists:attendance_devices,id'],
            'remarks' => ['nullable', 'string'],
        ]);

        $data['submitted_by'] = $request->user()->id;
        $data['status'] = 'draft';

        $record = AttendanceRecord::create($data);
        AuditLogger::log($record, 'created', [], $data);

        return response()->json($record, 201);
    }

    /** Bulk CSV import: array of rows, same shape as store(). */
    public function bulkImport(Request $request)
    {
        $data = $request->validate([
            'rows' => ['required', 'array', 'min:1'],
            'rows.*.employee_id' => ['required', 'exists:employees,id'],
            'rows.*.attendance_date' => ['required', 'date'],
            'rows.*.check_in_time' => ['nullable', 'date_format:H:i'],
            'rows.*.check_out_time' => ['nullable', 'date_format:H:i'],
        ]);

        $userId = $request->user()->id;
        $created = DB::transaction(function () use ($data, $userId) {
            $rows = collect($data['rows'])->map(fn ($row) => [
                ...$row,
                'source' => 'csv_import',
                'status' => 'draft',
                'submitted_by' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            AttendanceRecord::upsert(
                $rows->toArray(),
                ['employee_id', 'attendance_date'],
                ['check_in_time', 'check_out_time', 'source', 'status', 'submitted_by', 'updated_at']
            );

            return $rows->count();
        });

        return response()->json(['imported' => $created]);
    }

    /** Approval stepper: Draft -> Review -> Approved -> Locked. */
    public function transition(Request $request, AttendanceRecord $attendanceRecord)
    {
        $data = $request->validate([
            'status' => ['required', 'in:review,approved,locked'],
        ]);

        $this->authorize($data['status'] === 'locked' ? 'approve' : 'review', $attendanceRecord);

        $record = $this->approvals->transition($attendanceRecord, $data['status'], $request->user());

        return response()->json($record);
    }

    /** Only Super Admin may unlock — enforced in both policy and service. */
    public function unlock(Request $request, AttendanceRecord $attendanceRecord)
    {
        $this->authorize('unlock', $attendanceRecord);

        $record = $this->approvals->unlock($attendanceRecord, $request->user());

        return response()->json($record);
    }
}
