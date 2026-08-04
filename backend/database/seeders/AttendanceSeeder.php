<?php

namespace Database\Seeders;

use App\Models\AttendanceRecord;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $employee = Employee::first();

        if ($employee) {
            $today = Carbon::today()->toDateString();

            AttendanceRecord::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'date' => $today,
                ],
                [
                    'ministry_id' => $employee->ministry_id,
                    'check_in' => '08:55:00',
                    'check_out' => '17:05:00',
                    'status' => 'present',
                    'verification_source' => 'face_recognition',
                    'approval_status' => 'approved',
                    'reviewed_at' => now(),
                    'approved_at' => now(),
                ]
            );
        }
    }
}
