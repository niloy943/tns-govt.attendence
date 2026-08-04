<?php

namespace App\Policies;

use App\Models\AttendanceRecord;
use App\Models\User;

class AttendanceRecordPolicy
{
    public function view(User $user, AttendanceRecord $record): bool
    {
        return $user->isSuperAdmin()
            || ($user->isMinistryAdmin() && $user->ministry_id === $record->employee->ministry_id)
            || $user->employee_id === $record->employee_id;
    }

    public function review(User $user, AttendanceRecord $record): bool
    {
        return $user->isSuperAdmin()
            || ($user->isMinistryAdmin() && $user->ministry_id === $record->employee->ministry_id);
    }

    public function approve(User $user, AttendanceRecord $record): bool
    {
        return $this->review($user, $record);
    }

    /** Business rule from the frontend spec: only Super Admin unlocks a locked record. */
    public function unlock(User $user, AttendanceRecord $record): bool
    {
        return $user->isSuperAdmin();
    }
}
