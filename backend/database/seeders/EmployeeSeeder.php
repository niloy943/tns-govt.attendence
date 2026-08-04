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
        $wing = $mof ? DepartmentWing::where('ministry_id', $mof->id)->first() : null;

        if ($mof) {
            Employee::updateOrCreate(
                ['cadre_id' => 'CAD-2024-001'],
                [
                    'ministry_id' => $mof->id,
                    'department_wing_id' => $wing ? $wing->id : null,
                    'name' => 'Dr. Rahman Ahmed',
                    'designation' => 'Senior Secretary',
                    'email' => 'rahman.ahmed@mof.gov.bd',
                    'phone' => '+8801700000001',
                    'nid_passport' => '19822691234567890',
                    'employment_status' => 'permanent',
                    'base_salary' => 82000.00,
                    'joined_date' => '2010-01-15',
                ]
            );

            Employee::updateOrCreate(
                ['cadre_id' => 'CAD-2024-002'],
                [
                    'ministry_id' => $mof->id,
                    'department_wing_id' => $wing ? $wing->id : null,
                    'name' => 'Sultana Begum',
                    'designation' => 'Joint Secretary',
                    'email' => 'sultana.begum@mof.gov.bd',
                    'phone' => '+8801700000002',
                    'nid_passport' => '19852691234567891',
                    'employment_status' => 'permanent',
                    'base_salary' => 66000.00,
                    'joined_date' => '2012-05-20',
                ]
            );
        }
    }
}
