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
        $ministry = Ministry::create(['name' => 'Ministry of Finance', 'code' => 'MOF', 'budget_allocation' => 1000000]);
        $employee = Employee::create([
            'ministry_id' => $ministry->id,
            'name' => 'Test Employee',
            'cadre_id' => 'CAD-001',
            'designation' => 'Officer',
            'email' => 'officer@mof.gov.bd',
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
            'ministry_id' => $ministry->id,
            'date' => now()->toDateString(),
            'check_in' => '09:00:00',
            'check_out' => '17:00:00',
            'status' => 'present',
            'approval_status' => 'draft',
        ]);

        // Transition draft -> review
        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/transition", ['next_status' => 'review']);
        $response->assertStatus(200);
        $this->assertEquals('review', $record->fresh()->approval_status);

        // Transition review -> approved
        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/transition", ['next_status' => 'approved']);
        $response->assertStatus(200);
        $this->assertEquals('approved', $record->fresh()->approval_status);

        // Transition approved -> locked
        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/transition", ['next_status' => 'locked']);
        $response->assertStatus(200);
        $this->assertEquals('locked', $record->fresh()->approval_status);

        // Only Super Admin can unlock locked record
        $unlockDenied = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/unlock");
        $unlockDenied->assertStatus(403);

        $unlockAllowed = $this->actingAs($superAdmin, 'sanctum')
            ->patchJson("/api/attendance/{$record->id}/unlock");
        $unlockAllowed->assertStatus(200);
        $this->assertEquals('approved', $record->fresh()->approval_status);
    }
}
