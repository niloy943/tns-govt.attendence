<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /** Editable working hours + leave quota rules. */
    public function index(Request $request)
    {
        $settings = Setting::query()
            ->when($request->query('group'), fn ($q, $g) => $q->where('group', $g))
            ->get()
            ->groupBy('group');

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $this->authorize('create', \App\Models\Ministry::class); // super admin only

        $data = $request->validate([
            'group' => ['required', 'string', 'max:100'],
            'key' => ['required', 'string', 'max:100'],
            'value' => ['required'],
        ]);

        $setting = Setting::setValue($data['group'], $data['key'], $data['value']);

        return response()->json($setting);
    }

    public function getSalarySettings(Request $request)
    {
        $settings = Setting::query()->where('group', 'salary')->pluck('value', 'key');
        
        $default = [
            'id' => 1,
            'workingDays' => 26,
            'salaryPolicy' => 'working_days',
            'halfDayRule' => '50_percent',
            'latePolicy' => 'deduct_after_3',
            'pfPercentage' => 10,
            'taxPercentage' => 5,
            'warningPercentage' => 90,
            'criticalPercentage' => 100,
            'currency' => 'BDT',
            'payrollDate' => 25,
            'lockDate' => 30,
            'autoLock' => true,
        ];

        return response()->json(array_merge($default, $settings->toArray()));
    }

    public function updateSalarySettings(Request $request)
    {
        $this->authorize('create', \App\Models\Ministry::class);

        foreach ($request->all() as $key => $val) {
            Setting::setValue('salary', $key, $val);
        }

        return $this->getSalarySettings($request);
    }
}
