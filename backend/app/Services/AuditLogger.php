<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogger
{
    public static function log(Model $model, string $action, array $old = [], array $new = []): AuditLog
    {
        return AuditLog::create([
            'user_id' => Auth::id(),
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'action' => $action,
            'old_values' => $old ?: null,
            'new_values' => $new ?: null,
            'ip_address' => Request::ip(),
            'created_at' => now(),
        ]);
    }
}
