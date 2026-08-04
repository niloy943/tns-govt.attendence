<?php

namespace App\Providers;

use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Models\Ministry;
use App\Models\PayrollRecord;
use App\Policies\AttendanceRecordPolicy;
use App\Policies\EmployeePolicy;
use App\Policies\MinistryPolicy;
use App\Policies\PayrollPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Gate::policy(Ministry::class, MinistryPolicy::class);
        Gate::policy(Employee::class, EmployeePolicy::class);
        Gate::policy(AttendanceRecord::class, AttendanceRecordPolicy::class);
        Gate::policy(PayrollRecord::class, PayrollPolicy::class);
    }
}
