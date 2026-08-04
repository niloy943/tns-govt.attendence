<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceCorrection;
use Illuminate\Http\Request;

class AttendanceCorrectionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $corrections = AttendanceCorrection::with('employee:id,name,employee_code,ministry_id')
            ->when($user->isEmployee(), fn ($q) => $q->where('employee_id', $user->employee_id))
            ->when($user->isMinistryAdmin(), fn ($q) => $q->whereHas(
                'employee', fn ($e) => $e->where('ministry_id', $user->ministry_id)
            ))
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return response()->json($corrections);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id' => ['required', 'exists:employees,id'],
            'attendance_record_id' => ['nullable', 'exists:attendance_records,id'],
            'correction_date' => ['required', 'date'],
            'requested_check_in' => ['nullable', 'date_format:H:i'],
            'requested_check_out' => ['nullable', 'date_format:H:i'],
            'reason' => ['required', 'string'],
        ]);

        $correction = AttendanceCorrection::create($data);

        return response()->json($correction, 201);
    }

    public function review(Request $request, AttendanceCorrection $correction)
    {
        $data = $request->validate([
            'status' => ['required', 'in:approved,rejected'],
            'review_note' => ['nullable', 'string'],
        ]);

        $correction->update([
            ...$data,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        if ($data['status'] === 'approved' && $correction->attendance_record_id) {
            $correction->attendanceRecord()->update([
                'check_in_time' => $correction->requested_check_in,
                'check_out_time' => $correction->requested_check_out,
            ]);
        }

        return response()->json($correction);
    }
}
