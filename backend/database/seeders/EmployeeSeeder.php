<?php

namespace Database\Seeders;

use App\Models\DepartmentWing;
use App\Models\Employee;
use App\Models\Ministry;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $mof = Ministry::where('code', 'MOF')->first();
        
        // Let's create a default department wing for Ministry of Finance first if none exists
        $wing = null;
        if ($mof) {
            $wing = DepartmentWing::updateOrCreate(
                ['ministry_id' => $mof->id, 'name' => 'Finance Division'],
                ['code' => 'FD']
            );
        }

        if ($mof) {
            Employee::updateOrCreate(
                ['employee_code' => 'CAD-2024-001'],
                [
                    'ministry_id' => $mof->id,
                    'department_wing_id' => $wing ? $wing->id : null,
                    'name' => 'Dr. Rahman Ahmed',
                    'designation' => 'Senior Secretary',
                    'nid' => '19822691234567890',
                    'basic_salary' => 82000.00,
                    'hire_date' => '2010-01-15',
                    'status' => 'active',
                ]
            );

            Employee::updateOrCreate(
                ['employee_code' => 'CAD-2024-002'],
                [
                    'ministry_id' => $mof->id,
                    'department_wing_id' => $wing ? $wing->id : null,
                    'name' => 'Sultana Begum',
                    'designation' => 'Joint Secretary',
                    'nid' => '19852691234567891',
                    'basic_salary' => 66000.00,
                    'hire_date' => '2012-05-20',
                    'status' => 'active',
                ]
            );
        }
    }
}
