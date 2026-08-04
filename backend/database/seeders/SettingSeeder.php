<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'work_start_time', 'value' => '09:00', 'group' => 'attendance'],
            ['key' => 'work_end_time', 'value' => '17:00', 'group' => 'attendance'],
            ['key' => 'grace_period_minutes', 'value' => '15', 'group' => 'attendance'],
            ['key' => 'casual_leave_quota', 'value' => '14', 'group' => 'leave'],
            ['key' => 'sick_leave_quota', 'value' => '14', 'group' => 'leave'],
            ['key' => 'earned_leave_quota', 'value' => '30', 'group' => 'leave'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value'], 'group' => $setting['group']]
            );
        }
    }
}
