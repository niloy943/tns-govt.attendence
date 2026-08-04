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
}
