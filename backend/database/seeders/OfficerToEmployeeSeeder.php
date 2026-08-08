<?php

namespace Database\Seeders;

use App\Models\DepartmentWing;
use App\Models\Employee;
use App\Models\Ministry;
use App\Models\MowcaOfficer;
use App\Models\MswOfficer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OfficerToEmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Ministries
        $mowcaMinistry = Ministry::updateOrCreate(
            ['code' => 'MOWCA'],
            [
                'name' => 'Ministry of Women and Children Affairs',
                'type' => 'Ministry',
                'city' => 'Dhaka',
                'head_of_office' => 'Secretary, Ministry of Women and Children Affairs',
                'contact_email' => 'secretary@mowca.gov.bd',
                'contact_phone' => '+88-02-55101012',
                'status' => 'active',
            ]
        );

        $mswMinistry = Ministry::updateOrCreate(
            ['code' => 'MSW'],
            [
                'name' => 'Ministry of Social Welfare',
                'type' => 'Ministry',
                'city' => 'Dhaka',
                'head_of_office' => 'Secretary, Ministry of Social Welfare',
                'contact_email' => 'sec@msw.gov.bd',
                'contact_phone' => '02-55100452',
                'status' => 'active',
            ]
        );

        // 2. Import MoWCA officers
        $mowcaOfficers = MowcaOfficer::all();
        foreach ($mowcaOfficers as $off) {
            $this->createEmployeeFromOfficer($off, $mowcaMinistry, 'MOWCA');
        }

        // 3. Import MSW officers
        $mswOfficers = MswOfficer::all();
        foreach ($mswOfficers as $off) {
            $this->createEmployeeFromOfficer($off, $mswMinistry, 'MSW');
        }
    }

    private function createEmployeeFromOfficer($off, Ministry $ministry, string $prefix): void
    {
        if (empty($off->name)) {
            return;
        }

        // Create or get department wing
        $deptWing = null;
        if (! empty($off->department)) {
            $deptCode = strtoupper(Str::slug($off->department, '_'));
            if (strlen($deptCode) > 20) {
                $deptCode = substr($deptCode, 0, 20);
            }
            $deptWing = DepartmentWing::firstOrCreate(
                [
                    'ministry_id' => $ministry->id,
                    'name' => trim($off->department),
                ],
                [
                    'code' => $deptCode ?: 'DEPT_' . rand(100, 999),
                ]
            );
        }

        $code = ! empty($off->officer_id)
            ? "{$prefix}-" . str_pad($off->officer_id, 4, '0', STR_PAD_LEFT)
            : "{$prefix}-" . str_pad($off->id, 4, '0', STR_PAD_LEFT);

        // Determine level from designation
        $desig = strtolower($off->designation ?? '');
        $level = 4;
        if (str_contains($desig, 'minister') || str_contains($desig, 'secretary')) {
            $level = 1;
        } elseif (str_contains($desig, 'joint secretary') || str_contains($desig, 'deputy secretary') || str_contains($desig, 'director')) {
            $level = 2;
        } elseif (str_contains($desig, 'assistant secretary') || str_contains($desig, 'programmer') || str_contains($desig, 'analyst')) {
            $level = 3;
        }

        Employee::updateOrCreate(
            ['employee_code' => $code],
            [
                'ministry_id' => $ministry->id,
                'department_wing_id' => $deptWing ? $deptWing->id : null,
                'name' => trim($off->name),
                'designation' => $off->designation,
                'emergency_contact_phone' => $off->mobile ?: $off->phone_office,
                'level' => $level,
                'status' => 'active',
            ]
        );
    }
}
