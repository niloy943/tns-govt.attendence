<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Casual', 'yearly_cap' => 14, 'requires_attachment' => false],
            ['name' => 'Sick', 'yearly_cap' => 14, 'requires_attachment' => false],
            ['name' => 'Earned', 'yearly_cap' => 30, 'requires_attachment' => false],
            ['name' => 'Rotational', 'yearly_cap' => 21, 'requires_attachment' => false],
            ['name' => 'Medical', 'yearly_cap' => 60, 'requires_attachment' => true],
        ];

        foreach ($types as $type) {
            LeaveType::updateOrCreate(['name' => $type['name']], $type);
        }
    }
}
