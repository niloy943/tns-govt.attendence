<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Hierarchy chart data: employees with manager/subordinate links, searchable by name/designation.
     * 
     * GET /api/employees/hierarchy
     */
    public function hierarchy(Request $request)
    {
        $user = $request->user();

        $employees = Employee::select('id', 'name', 'designation', 'level', 'reports_to', 'ministry_id')
            // Restrict non-superadmins to their own ministry branch
            ->when($user && !$user->isSuperAdmin(), fn ($q) => $q->where('ministry_id', $user->ministry_id))
            // Enable general name or designation search queries
            ->when($request->query('search'), fn ($q, $s) => $q->where(function ($qq) use ($s) {
                $qq->where('name', 'like', "%{$s}%")->orWhere('designation', 'like', "%{$s}%");
            }))
            ->orderBy('level')
            ->get();

        return response()->json($employees);
    }
}
