<?php

namespace App\Policies;

use App\Models\Employee;
use App\Models\User;

class EmployeePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Employee $employee): bool
    {
        return $user->isSuperAdmin()
            || $user->ministry_id === $employee->ministry_id
            || $user->employee_id === $employee->id;
    }

    public function create(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isMinistryAdmin();
    }

    public function update(User $user, Employee $employee): bool
    {
        return $user->isSuperAdmin()
            || ($user->isMinistryAdmin() && $user->ministry_id === $employee->ministry_id);
    }

    public function delete(User $user, Employee $employee): bool
    {
        return $user->isSuperAdmin();
    }
}
