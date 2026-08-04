<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('create', \App\Models\Ministry::class); // super admin only

        $logs = AuditLog::with('user:id,name,role')
            ->when($request->query('auditable_type'), fn ($q, $t) => $q->where('auditable_type', $t))
            ->when($request->query('user_id'), fn ($q, $id) => $q->where('user_id', $id))
            ->latest('created_at')
            ->paginate($request->integer('per_page', 30));

        return response()->json($logs);
    }
}
