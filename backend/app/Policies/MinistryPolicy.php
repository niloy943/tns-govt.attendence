<?php

namespace App\Policies;

use App\Models\Ministry;
use App\Models\User;

class MinistryPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // all roles can list ministries (scoped further in controller)
    }

    public function view(User $user, Ministry $ministry): bool
    {
        return $user->isSuperAdmin() || $user->ministry_id === $ministry->id;
    }

    public function create(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    public function update(User $user, Ministry $ministry): bool
    {
        return $user->isSuperAdmin();
    }

    public function delete(User $user, Ministry $ministry): bool
    {
        return $user->isSuperAdmin();
    }
}
