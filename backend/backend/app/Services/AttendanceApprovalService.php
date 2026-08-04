<?php

namespace App\Services;

use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AttendanceApprovalService
{
    /** Allowed forward transitions in the approval stepper. */
    private const TRANSITIONS = [
        'draft' => ['review'],
        'review' => ['approved', 'draft'],
        'approved' => ['locked', 'review'],
        'locked' => [], // only unlock() can move out of locked
    ];

    public function transition(AttendanceRecord $record, string $toStatus, User $actor): AttendanceRecord
    {
        $from = $record->status;

        if (! in_array($toStatus, self::TRANSITIONS[$from] ?? [], true)) {
            throw ValidationException::withMessages([
                'status' => "Cannot move attendance record from '{$from}' to '{$toStatus}'.",
            ]);
        }

        $record->status = $toStatus;

        match ($toStatus) {
            'review' => $record->reviewed_by = $actor->id,
            'approved' => $record->approved_by = $actor->id,
            'locked' => [$record->locked_by = $actor->id, $record->locked_at = now()],
            default => null,
        };

        $record->save();
        AuditLogger::log($record, "attendance_{$toStatus}", ['status' => $from], ['status' => $toStatus]);

        return $record;
    }

    /** Only Super Admin may unlock a locked record — enforced here AND via policy/route middleware. */
    public function unlock(AttendanceRecord $record, User $actor): AttendanceRecord
    {
        if (! $actor->isSuperAdmin()) {
            throw ValidationException::withMessages([
                'status' => 'Only a Super Admin can unlock a locked attendance record.',
            ]);
        }

        if ($record->status !== 'locked') {
            throw ValidationException::withMessages(['status' => 'Record is not locked.']);
        }

        $record->status = 'approved';
        $record->locked_by = null;
        $record->locked_at = null;
        $record->save();

        AuditLogger::log($record, 'attendance_unlocked', ['status' => 'locked'], ['status' => 'approved']);

        return $record;
    }
}
