<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Employee::class);
        $user = $request->user();

        $employees = Employee::with(['ministry', 'departmentWing', 'manager'])
            ->when(! $user->isSuperAdmin(), fn ($q) => $q->where('ministry_id', $user->ministry_id))
            ->when($request->query('ministry_id'), fn ($q, $id) => $q->where('ministry_id', $id))
            ->when($request->query('department_wing_id'), fn ($q, $id) => $q->where('department_wing_id', $id))
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->query('pay_grade'), fn ($q, $g) => $q->where('pay_grade', $g))
            ->when($request->query('search'), fn ($q, $s) => $q->where(function ($qq) use ($s) {
                $qq->where('name', 'like', "%{$s}%")
                    ->orWhere('employee_code', 'like', "%{$s}%")
                    ->orWhere('nid', 'like', "%{$s}%");
            }))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 20));

        return response()->json($employees);
    }

    public function show(Employee $employee)
    {
        $this->authorize('view', $employee);

        return response()->json(
            $employee->load(['ministry', 'departmentWing', 'manager', 'subordinates', 'userAccount'])
        );
    }

    public function store(Request $request)
    {
        $this->authorize('create', Employee::class);

        $data = $this->validated($request);
        $employee = Employee::create($data);
        AuditLogger::log($employee, 'created', [], $data);

        return response()->json($employee, 201);
    }

    public function update(Request $request, Employee $employee)
    {
        $this->authorize('update', $employee);

        $data = $this->validated($request, $employee->id);
        $old = $employee->only(array_keys($data));
        $employee->update($data);
        AuditLogger::log($employee, 'updated', $old, $data);

        return response()->json($employee);
    }

    public function destroy(Employee $employee)
    {
        $this->authorize('delete', $employee);

        $employee->delete();
        AuditLogger::log($employee, 'deleted');

        return response()->json(['message' => 'Employee deleted.']);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'employee_code' => ['required', 'string', 'max:50', 'unique:employees,employee_code,'.$ignoreId],
            'nid' => ['nullable', 'string', 'max:30', 'unique:employees,nid,'.$ignoreId],
            'passport_no' => ['nullable', 'string', 'max:30'],
            'name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:male,female,other'],
            'education' => ['nullable', 'array'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:30'],
            'ministry_id' => ['required', 'exists:ministries,id'],
            'department_wing_id' => ['nullable', 'exists:department_wings,id'],
            'designation' => ['nullable', 'string', 'max:255'],
            'level' => ['nullable', 'integer', 'min:1'],
            'reports_to' => ['nullable', 'exists:employees,id'],
            'pay_grade' => ['nullable', 'string', 'max:50'],
            'basic_salary' => ['nullable', 'numeric', 'min:0'],
            'hire_date' => ['nullable', 'date'],
            'status' => ['nullable', 'in:active,inactive,suspended,retired'],
        ]);
    }
}
