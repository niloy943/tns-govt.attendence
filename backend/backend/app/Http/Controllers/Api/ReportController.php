<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\PayrollRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response as FacadesResponse;

class ReportController extends Controller
{
    /** The 4 report template cards. */
    public function templates()
    {
        return response()->json([
            ['key' => 'attendance_summary', 'name' => 'Attendance Summary'],
            ['key' => 'leave_summary', 'name' => 'Leave Summary'],
            ['key' => 'payroll_summary', 'name' => 'Payroll Summary'],
            ['key' => 'ministry_headcount', 'name' => 'Ministry-wise Headcount'],
        ]);
    }

    /** Streams a CSV export for the requested template + filters. */
    public function export(Request $request, string $template)
    {
        $data = $request->validate([
            'ministry_id' => ['nullable', 'exists:ministries,id'],
            'month' => ['nullable', 'integer', 'min:1', 'max:12'],
            'year' => ['nullable', 'integer', 'min:2000'],
        ]);

        [$headers, $rows] = match ($template) {
            'attendance_summary' => $this->attendanceSummary($data),
            'leave_summary' => $this->leaveSummary($data),
            'payroll_summary' => $this->payrollSummary($data),
            'ministry_headcount' => $this->ministryHeadcount(),
            default => abort(404, 'Unknown report template.'),
        };

        $callback = function () use ($headers, $rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, $headers);
            foreach ($rows as $row) {
                fputcsv($out, $row);
            }
            fclose($out);
        };

        return FacadesResponse::stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$template}.csv",
        ]);
    }

    private function attendanceSummary(array $f): array
    {
        $rows = AttendanceRecord::query()
            ->join('employees', 'employees.id', '=', 'attendance_records.employee_id')
            ->when($f['ministry_id'] ?? null, fn ($q, $id) => $q->where('employees.ministry_id', $id))
            ->when($f['month'] ?? null, fn ($q, $m) => $q->whereMonth('attendance_date', $m))
            ->when($f['year'] ?? null, fn ($q, $y) => $q->whereYear('attendance_date', $y))
            ->select('employees.employee_code', 'employees.name', 'attendance_date', 'check_in_time', 'check_out_time', 'source', 'status')
            ->orderBy('attendance_date')
            ->get();

        return [
            ['Employee Code', 'Name', 'Date', 'Check In', 'Check Out', 'Source', 'Status'],
            $rows->map(fn ($r) => [$r->employee_code, $r->name, $r->attendance_date, $r->check_in_time, $r->check_out_time, $r->source, $r->status])->toArray(),
        ];
    }

    private function leaveSummary(array $f): array
    {
        $rows = LeaveRequest::query()
            ->join('employees', 'employees.id', '=', 'leave_requests.employee_id')
            ->join('leave_types', 'leave_types.id', '=', 'leave_requests.leave_type_id')
            ->when($f['ministry_id'] ?? null, fn ($q, $id) => $q->where('employees.ministry_id', $id))
            ->select('employees.employee_code', 'employees.name', 'leave_types.name as leave_type', 'start_date', 'end_date', 'days_count', 'leave_requests.status')
            ->orderBy('start_date')
            ->get();

        return [
            ['Employee Code', 'Name', 'Leave Type', 'Start', 'End', 'Days', 'Status'],
            $rows->map(fn ($r) => [$r->employee_code, $r->name, $r->leave_type, $r->start_date, $r->end_date, $r->days_count, $r->status])->toArray(),
        ];
    }

    private function payrollSummary(array $f): array
    {
        $rows = PayrollRecord::query()
            ->join('employees', 'employees.id', '=', 'payroll_records.employee_id')
            ->when($f['ministry_id'] ?? null, fn ($q, $id) => $q->where('payroll_records.ministry_id', $id))
            ->when($f['month'] ?? null, fn ($q, $m) => $q->where('payroll_records.month', $m))
            ->when($f['year'] ?? null, fn ($q, $y) => $q->where('payroll_records.year', $y))
            ->select('employees.employee_code', 'employees.name', 'month', 'year', 'basic_salary', 'gross_allowances', 'gross_deductions', 'net_salary', 'payroll_records.status')
            ->get();

        return [
            ['Employee Code', 'Name', 'Month', 'Year', 'Basic', 'Allowances', 'Deductions', 'Net Salary', 'Status'],
            $rows->map(fn ($r) => [$r->employee_code, $r->name, $r->month, $r->year, $r->basic_salary, $r->gross_allowances, $r->gross_deductions, $r->net_salary, $r->status])->toArray(),
        ];
    }

    private function ministryHeadcount(): array
    {
        $rows = Employee::query()
            ->join('ministries', 'ministries.id', '=', 'employees.ministry_id')
            ->selectRaw('ministries.name as ministry, count(*) as headcount')
            ->groupBy('ministries.name')
            ->orderBy('ministries.name')
            ->get();

        return [
            ['Ministry', 'Headcount'],
            $rows->map(fn ($r) => [$r->ministry, $r->headcount])->toArray(),
        ];
    }
}
