<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceDevice;
use Illuminate\Http\Request;

class AttendanceDeviceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $devices = AttendanceDevice::with('ministry:id,name')
            ->when(! $user->isSuperAdmin(), fn ($q) => $q->where('ministry_id', $user->ministry_id))
            ->when($request->query('type'), fn ($q, $t) => $q->where('type', $t))
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->orderBy('name')
            ->get();

        return response()->json($devices);
    }

    public function store(Request $request)
    {
        $this->authorize('create', \App\Models\Ministry::class); // reuse: only admins register devices

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:id_card,fingerprint,face_recognition,qr'],
            'ministry_id' => ['required', 'exists:ministries,id'],
            'location' => ['nullable', 'string', 'max:255'],
            'serial_number' => ['nullable', 'string', 'max:100', 'unique:attendance_devices,serial_number'],
            'status' => ['nullable', 'in:online,offline,maintenance'],
        ]);

        return response()->json(AttendanceDevice::create($data), 201);
    }

    public function update(Request $request, AttendanceDevice $device)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:online,offline,maintenance'],
        ]);

        $device->update($data);

        return response()->json($device);
    }

    public function destroy(AttendanceDevice $device)
    {
        $device->delete();

        return response()->json(['message' => 'Device removed.']);
    }
}
