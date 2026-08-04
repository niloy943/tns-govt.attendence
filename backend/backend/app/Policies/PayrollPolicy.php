<?php

namespace App\Policies;

use App\Models\PayrollRecord;
use App\Models\User;

class PayrollPolicy
{
    public function view(User $user, PayrollRecord $record): bool
    {
        return $user->isSuperAdmin()
            || ($user->isMinistryAdmin() && $user->ministry_id === $record->ministry_id)
            || $user->employee_id === $record->employee_id;
    }

    public function generate(User $user): bool
    {
        return $user->isSuperAdmin() || $user->isMinistryAdmin();
    }

    public function lock(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    public function configureRules(User $user): bool
    {
        return $user->isSuperAdmin();
    }
}
