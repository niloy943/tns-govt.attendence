<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MowcaOfficer;
use App\Models\MswOfficer;
use Illuminate\Http\Request;

class OfficerController extends Controller
{
    public function mowca(Request $request)
    {
        $query = MowcaOfficer::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%");
            });
        }

        if ($department = $request->query('department')) {
            $query->where('department', $department);
        }

        return response()->json($query->orderBy('overall_sl')->paginate($request->integer('per_page', 25)));
    }

    public function msw(Request $request)
    {
        $query = MswOfficer::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%");
            });
        }

        if ($department = $request->query('department')) {
            $query->where('department', $department);
        }

        return response()->json($query->orderBy('overall_sl')->paginate($request->integer('per_page', 25)));
    }
}
