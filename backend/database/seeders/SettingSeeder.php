<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'work_start_time', 'value' => ['time' => '09:00'], 'group' => 'working_hours'],
            ['key' => 'work_end_time', 'value' => ['time' => '17:00'], 'group' => 'working_hours'],
            ['key' => 'grace_period_minutes', 'value' => ['minutes' => 15], 'group' => 'working_hours'],
            ['key' => 'casual_leave_quota', 'value' => ['quota' => 14], 'group' => 'leave_quota'],
            ['key' => 'sick_leave_quota', 'value' => ['quota' => 14], 'group' => 'leave_quota'],
            ['key' => 'earned_leave_quota', 'value' => ['quota' => 30], 'group' => 'leave_quota'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['group' => $setting['group'], 'key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }
    }
}
