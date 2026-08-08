<?php

use App\Http\Controllers\Api\AttendanceCorrectionController;
use App\Http\Controllers\Api\AttendanceDeviceController;
use App\Http\Controllers\Api\AttendanceRecordController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartmentWingController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\LeaveTypeController;
use App\Http\Controllers\Api\MinistryController;
use App\Http\Controllers\Api\OfficerController;
use App\Http\Controllers\Api\OvertimeController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\PayrollRuleController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

// --- Public ---
Route::post('/auth/login', [AuthController::class, 'login']);

// --- Authenticated (any role) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dedicated Officer Endpoints
    Route::get('/officers/mowca', [OfficerController::class, 'mowca']);
    Route::get('/officers/msw', [OfficerController::class, 'msw']);

    // Dashboard
    Route::get('/dashboard/central', [DashboardController::class, 'central']);
    Route::get('/dashboard/ministry/{ministry}', [DashboardController::class, 'ministry']);

    // Ministries (write ops gated by policy inside controller: super_admin only)
    Route::apiResource('ministries', MinistryController::class);
    Route::get('/ministries/{ministry}/department-wings', [DepartmentWingController::class, 'index']);
    Route::post('/ministries/{ministry}/department-wings', [DepartmentWingController::class, 'store']);
    Route::put('/ministries/{ministry}/department-wings/{wing}', [DepartmentWingController::class, 'update']);
    Route::delete('/ministries/{ministry}/department-wings/{wing}', [DepartmentWingController::class, 'destroy']);

    // Employees
    Route::apiResource('employees', EmployeeController::class);

    // Attendance
    Route::get('/attendance/devices', [AttendanceDeviceController::class, 'index']);
    Route::get('/attendance', [AttendanceRecordController::class, 'index']);
    Route::get('/attendance/sheet', [AttendanceRecordController::class, 'sheet']);
    Route::get('/attendance/summary', [AttendanceRecordController::class, 'monthlySummary']);
    Route::get('/attendance/monthly-summary', [AttendanceRecordController::class, 'monthlySummary']);
    Route::get('/attendance/individual/{employeeId}', [AttendanceRecordController::class, 'individual']);
    Route::post('/attendance', [AttendanceRecordController::class, 'store']);
    Route::post('/attendance/bulk-import', [AttendanceRecordController::class, 'bulkImport']);
    Route::patch('/attendance/{attendanceRecord}/transition', [AttendanceRecordController::class, 'transition']);
    Route::get('/attendance/corrections', [AttendanceCorrectionController::class, 'index']);
    Route::post('/attendance/corrections', [AttendanceCorrectionController::class, 'store']);

    // Leave
    Route::get('/leave-types', [LeaveTypeController::class, 'index']);
    Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
    Route::patch('/leave-requests/{leaveRequest}/cancel', [LeaveRequestController::class, 'cancel']);
    Route::get('/employees/{employeeId}/leave-balance', [LeaveRequestController::class, 'balance']);

    // Overtime
    Route::get('/overtime', [OvertimeController::class, 'index']);
    Route::post('/overtime', [OvertimeController::class, 'store']);

    // Payroll / Budget
    Route::get('/payroll', [PayrollController::class, 'index']);
    Route::get('/payroll/distribution', [PayrollController::class, 'distribution']);
    Route::get('/payroll/{payrollRecord}', [PayrollController::class, 'show']);
    Route::get('/budget', [BudgetController::class, 'index']);
    Route::get('/payroll-rules', [PayrollRuleController::class, 'index']);

    // Reports
    Route::get('/reports/templates', [ReportController::class, 'templates']);
    Route::get('/reports/{template}/export', [ReportController::class, 'export']);

    // Settings (read: any role; write: super_admin, gated in controller)
    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings', [SettingController::class, 'update']);
    Route::get('/salary/settings', [SettingController::class, 'getSalarySettings']);
    Route::put('/salary/settings', [SettingController::class, 'updateSalarySettings']);

    // --- Ministry Admin + Super Admin only ---
    Route::middleware('role:super_admin,ministry_admin')->group(function () {
        Route::post('/attendance/devices', [AttendanceDeviceController::class, 'store']);
        Route::put('/attendance/devices/{device}', [AttendanceDeviceController::class, 'update']);
        Route::patch('/attendance/corrections/{correction}/review', [AttendanceCorrectionController::class, 'review']);
        Route::patch('/leave-requests/{leaveRequest}/review', [LeaveRequestController::class, 'review']);
        Route::patch('/overtime/{overtimeRecord}/review', [OvertimeController::class, 'review']);
        Route::post('/payroll/generate', [PayrollController::class, 'generate']);
    });

    // --- Super Admin only ---
    Route::middleware('role:super_admin')->group(function () {
        Route::delete('/attendance/devices/{device}', [AttendanceDeviceController::class, 'destroy']);
        Route::patch('/attendance/{attendanceRecord}/unlock', [AttendanceRecordController::class, 'unlock']);
        Route::put('/leave-types/{leaveType}', [LeaveTypeController::class, 'update']);
        Route::post('/budget', [BudgetController::class, 'store']);
        Route::put('/budget/{budgetAllocation}', [BudgetController::class, 'update']);
        Route::put('/payroll-rules/{payrollRule}', [PayrollRuleController::class, 'update']);
        Route::patch('/payroll/{payrollRecord}/lock', [PayrollController::class, 'lock']);
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
    });
});
