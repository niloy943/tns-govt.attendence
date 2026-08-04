<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DepartmentWing;
use App\Models\Ministry;
use Illuminate\Http\Request;

class DepartmentWingController extends Controller
{
    public function index(Ministry $ministry)
    {
        return response()->json($ministry->departmentWings()->withCount('employees')->get());
    }

    public function store(Request $request, Ministry $ministry)
    {
        $this->authorize('update', $ministry);

        $data = $request->validate([
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'head_of_wing' => ['nullable', 'string', 'max:255'],
        ]);

        $wing = $ministry->departmentWings()->create($data);

        return response()->json($wing, 201);
    }

    public function update(Request $request, Ministry $ministry, DepartmentWing $wing)
    {
        $this->authorize('update', $ministry);

        $data = $request->validate([
            'code' => ['sometimes', 'string', 'max:50'],
            'name' => ['sometimes', 'string', 'max:255'],
            'head_of_wing' => ['nullable', 'string', 'max:255'],
        ]);

        $wing->update($data);

        return response()->json($wing);
    }

    public function destroy(Ministry $ministry, DepartmentWing $wing)
    {
        $this->authorize('update', $ministry);

        $wing->delete();

        return response()->json(['message' => 'Department wing deleted.']);
    }
}
