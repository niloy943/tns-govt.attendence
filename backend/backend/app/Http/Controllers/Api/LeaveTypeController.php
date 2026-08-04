<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Illuminate\Http\Request;

class LeaveTypeController extends Controller
{
    public function index()
    {
        return response()->json(LeaveType::orderBy('name')->get());
    }

    public function update(Request $request, LeaveType $leaveType)
    {
        $this->authorize('create', \App\Models\Ministry::class); // super admin only

        $data = $request->validate([
            'yearly_cap' => ['sometimes', 'integer', 'min:0'],
            'requires_attachment' => ['sometimes', 'boolean'],
        ]);

        $leaveType->update($data);

        return response()->json($leaveType);
    }
}
