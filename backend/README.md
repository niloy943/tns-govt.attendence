# Govt Attendance — Backend API

Laravel 11 + PostgreSQL / SQLite REST API for the Government Ministry Management System
(the `hrms-tns` frontend / `tns-govt.attendence` repo). Built to match the same
resource shapes the frontend's `useX` React Query hooks expect.

## What's included

- **Auth & RBAC** — Sanctum token auth, 3 roles (`super_admin`, `ministry_admin`, `employee`), a `role:` route middleware, and Policy classes for finer-grained rules.
- **Ministries** — CRUD + nested Department Wings.
- **Employees** — full profile, self-referential hierarchy (`reports_to`), audit trail endpoint.
- **Attendance** — 7 sources, Draft → Review → Approved → Locked approval stepper, devices registry, correction requests, calendar-grid "sheet" view, monthly summary, dashboard aggregates.
- **Leave** — 5 leave types seeded with yearly caps (Casual 14 / Sick 14 / Earned 30 / Rotational 21 / Medical 60), cap-enforcing `LeaveBalanceService`, attachment requirement for Medical leave.
- **Overtime** — duty log with approve/reject.
- **Salary / Payroll / Budget** — itemized allowance/deduction generation, `PayrollService` that **blocks payroll generation if it would exceed the ministry's budget allocation**, 6 configurable rule cards, department distribution + trend endpoints.
- **Reports** — CSV export for 4 templates (Attendance Summary, Leave Summary, Payroll Summary, Ministry Headcount).
- **Settings** — working hours + leave quota key/value store.
- **Audit Logs** — generic `AuditLog` model + `AuditLogger` service.
- **Feature Tests** — PHPUnit tests covering approval stepper transitions, unlock policies, and budget-cap blocking logic.

## Setup Instructions

Make sure you are in the root backend directory: `d:\tns-hrms\backend`.

```powershell
# 1. Disable policy advisories block & install dependencies
$env:COMPOSER_POLICY_ADVISORIES_BLOCK="false"
composer install --ignore-platform-reqs

# 2. Configure environment
cp .env.example .env
php artisan key:generate

# 3. Run migrations and seed database
php artisan migrate --seed

# 4. Serve backend API at http://localhost:8000/api
php artisan serve
```

Seeded logins (password `password` for both):
- `superadmin@tns.gov.bd` — Super Admin
- `admin.mof@tns.gov.bd` — Ministry Admin (Ministry of Finance)

Point the frontend's `VITE_API_BASE_URL` at `http://localhost:8000/api` and set `VITE_USE_DUMMY_DATA=false`.
