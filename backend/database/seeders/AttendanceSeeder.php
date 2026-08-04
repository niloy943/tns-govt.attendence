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
                    'attendance_date' => $today,
                ],
                [
                    'check_in_time' => '08:55:00',
                    'check_out_time' => '17:05:00',
                    'source' => 'face_recognition',
                    'status' => 'approved',
                    'remarks' => 'Auto-present seeder log',
                ]
            );
        }
    }
}
