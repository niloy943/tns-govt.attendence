<?php

namespace Tests\Feature;

use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Models\Ministry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceApprovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_attendance_stepper_transition_and_lock_policy(): void
    {
        $ministry = Ministry::create(['name' => 'Ministry of Finance', 'code' => 'MOF']);
        $employee = Employee::create([
            'ministry_id' => $ministry->id,
            'name' => 'Test Employee',
            'employee_code' => 'CAD-001',
            'designation' => 'Officer',
        ]);

        $admin = User::create([
            'name' => 'MOF Admin',
            'email' => 'admin@mof.gov.bd',
            'password' => bcrypt('password'),
            'role' => 'ministry_admin',
            'ministry_id' => $ministry->id,
        ]);

        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@tns.gov.bd',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
        ]);

        $record = AttendanceRecord::create([
            'employee_id' => $employee->id,
            'attendance_date' => now()->toDateString(),
            'check_in_time' => '09:00:00',
            'check_out_time' => '17:00:00',
            'source' => 'face_recognition',
            'status' => 'draft',
        ]);

        // Transition draft -> review
        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/transition", ['status' => 'review']);
        $response->assertStatus(200);
        $this->assertEquals('review', $record->fresh()->status);

        // Transition review -> approved
        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/transition", ['status' => 'approved']);
        $response->assertStatus(200);
        $this->assertEquals('approved', $record->fresh()->status);

        // Transition approved -> locked
        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/transition", ['status' => 'locked']);
        $response->assertStatus(200);
        $this->assertEquals('locked', $record->fresh()->status);

        // Only Super Admin can unlock locked record
        $unlockDenied = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/unlock");
        $unlockDenied->assertStatus(403);

        $unlockAllowed = $this->actingAs($superAdmin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/unlock");
        $unlockAllowed->assertStatus(200);
        $this->assertEquals('approved', $record->fresh()->status);
    }
}
