<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ministry;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

class MinistryController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Ministry::class);

        $ministries = Ministry::withCount('employees')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('search'), fn ($q, $s) => $q->where('name', 'ilike', "%{$s}%"))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 20));

        return response()->json($ministries);
    }

    public function show(Ministry $ministry)
    {
        $this->authorize('view', $ministry);

        return response()->json($ministry->load('departmentWings')->loadCount('employees'));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Ministry::class);

        $data = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:ministries,code'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'head_of_office' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email'],
            'contact_phone' => ['nullable', 'string', 'max:30'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        $ministry = Ministry::create($data);
        AuditLogger::log($ministry, 'created', [], $data);

        return response()->json($ministry, 201);
    }

    public function update(Request $request, Ministry $ministry)
    {
        $this->authorize('update', $ministry);

        $data = $request->validate([
            'code' => ['sometimes', 'string', 'max:50', 'unique:ministries,code,'.$ministry->id],
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'head_of_office' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email'],
            'contact_phone' => ['nullable', 'string', 'max:30'],
            'status' => ['nullable', 'in:active,inactive'],
        ]);

        $old = $ministry->only(array_keys($data));
        $ministry->update($data);
        AuditLogger::log($ministry, 'updated', $old, $data);

        return response()->json($ministry);
    }

    public function destroy(Ministry $ministry)
    {
        $this->authorize('delete', $ministry);

        $ministry->delete();
        AuditLogger::log($ministry, 'deleted');

        return response()->json(['message' => 'Ministry deleted.']);
    }
}
