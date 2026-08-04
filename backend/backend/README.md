# Govt Attendance — Backend API

Laravel 11 + PostgreSQL REST API for the Government Ministry Management System
(the `hrms-tns` frontend / `tns-govt.attendence` repo). Built to match the same
resource shapes the frontend's `useX` React Query hooks already expect, so you
can flip `VITE_USE_DUMMY_DATA=false` and point `apiClient` at this API once it's
running.

## What's included

- **Auth & RBAC** — Sanctum token auth, 3 roles (`super_admin`, `ministry_admin`, `employee`), a `role:` route middleware, and Policy classes for the finer-grained rules (e.g. "only Super Admin unlocks a locked attendance record").
- **Ministries** — CRUD + nested Department Wings.
- **Employees** — full profile (NID/passport, cadre ID, education, emergency contact), self-referential hierarchy (`reports_to`), audit trail endpoint.
- **Attendance** — records across all 7 sources (ID Card, Fingerprint, Face Recognition, QR, Manual, CSV Import, API Sync), Draft → Review → Approved → Locked approval stepper, devices registry, correction requests, calendar-grid "sheet" view, monthly summary, dashboard aggregates.
- **Leave** — 5 leave types seeded with yearly caps (Casual 14 / Sick 14 / Earned 30 / Rotational 21 / Medical 60), cap-enforcing `LeaveBalanceService`, attachment requirement for Medical leave.
- **Overtime** — duty log with approve/reject.
- **Salary / Payroll / Budget** — itemized allowance/deduction generation, `PayrollService` that **blocks payroll generation if it would exceed the ministry's budget allocation** (matches the "block payroll on budget exceed" rule), 6 configurable rule cards, department distribution + trend endpoints.
- **Reports** — CSV export for the 4 templates (Attendance Summary, Leave Summary, Payroll Summary, Ministry Headcount).
- **Settings** — working hours + leave quota key/value store.
- **Audit Logs** — generic `AuditLog` model + `AuditLogger` service, wired into Ministries, Employees, Attendance transitions, and Payroll generation.
- **Notifications** — standard Laravel `notifications` table + a `notification_preferences` table for the bell-icon/settings toggle.

## What's deliberately left out (and why)

This was written as source code, not a booted app — my sandbox has no network
access, so I can't run `composer install` or `artisan migrate` here. To keep
the file count manageable I also skipped:
- Dedicated `FormRequest` classes (validation is inline in controllers via `$request->validate()` — functionally identical, fewer files).
- Automated tests (happy to add PHPUnit/Pest feature tests as a follow-up).
- Real-time broadcasting for notifications (currently DB-only; add `laravel/reverb` or Pusher if you want live push).
- PDF export for reports (CSV is wired up; `barryvdh/laravel-dompdf` is already in `composer.json` if you want to add PDF next).

## Setup

```bash
# 1. Scaffold a fresh Laravel app (this downloads the framework — needs network)
composer create-project laravel/laravel govt-attendance-backend
cd govt-attendance-backend

# 2. Copy this delivered code in, overwriting the defaults
#    (app/, database/, routes/, bootstrap/app.php, composer.json, .env.example)
cp -r /path/to/delivered/app/* app/
cp -r /path/to/delivered/database/* database/
cp /path/to/delivered/routes/api.php routes/api.php
cp /path/to/delivered/bootstrap/app.php bootstrap/app.php
cp /path/to/delivered/composer.json composer.json
cp /path/to/delivered/.env.example .env.example

# 3. Install dependencies (adds Sanctum, Excel, DomPDF on top of the base Laravel deps)
composer install

# 4. Configure environment
cp .env.example .env
php artisan key:generate
# edit .env with your Postgres credentials (DB_DATABASE, DB_USERNAME, DB_PASSWORD)

# 5. Create the database, then migrate + seed
createdb tns_govt_attendance   # or via your Postgres GUI of choice
php artisan migrate --seed

# 6. Run it
php artisan serve
```

Seeded logins (from `UserSeeder`, password `password` for both):
- `superadmin@tns.gov.bd` — Super Admin
- `admin.mof@tns.gov.bd` — Ministry Admin (Ministry of Finance)

Point the frontend's `apiClient` base URL at `http://localhost:8000/api` and
set `VITE_USE_DUMMY_DATA=false`.

## API reference

All routes below are prefixed `/api` and (except login) require a Sanctum
bearer token: `Authorization: Bearer {token}`.

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/auth/login` | Public. Returns `{ token, user }` |
| POST | `/auth/logout` | |
| GET | `/auth/me` | |
| GET | `/dashboard/central` | Government-wide stats + ministries table |
| GET | `/dashboard/ministry/{ministry}` | Department-wise donut + live log |
| GET/POST/PUT/DELETE | `/ministries[/{id}]` | Write ops: Super Admin only |
| GET/POST/PUT/DELETE | `/ministries/{id}/department-wings[/{id}]` | |
| GET | `/employees/hierarchy` | Org chart data |
| GET/POST/PUT/DELETE | `/employees[/{id}]` | |
| GET | `/employees/{id}/audit-trail` | |
| GET | `/attendance` | List/Daily view, filterable |
| GET | `/attendance/sheet` | Calendar-grid register |
| GET | `/attendance/monthly-summary` | |
| GET | `/attendance/individual/{employeeId}` | |
| POST | `/attendance` | Manual entry |
| POST | `/attendance/bulk-import` | CSV rows |
| PATCH | `/attendance/{id}/transition` | `draft→review→approved→locked` |
| PATCH | `/attendance/{id}/unlock` | **Super Admin only** |
| GET/POST/PUT/DELETE | `/attendance/devices[/{id}]` | |
| GET/POST | `/attendance/corrections` | |
| PATCH | `/attendance/corrections/{id}/review` | |
| GET | `/leave-types` | |
| PUT | `/leave-types/{id}` | Super Admin only |
| GET/POST | `/leave-requests` | |
| PATCH | `/leave-requests/{id}/review` \| `/cancel` | |
| GET | `/employees/{id}/leave-balance` | |
| GET/POST | `/overtime` | |
| PATCH | `/overtime/{id}/review` | |
| GET | `/payroll` | |
| GET | `/payroll/{id}` | Itemized breakdown |
| GET | `/payroll/distribution` | |
| POST | `/payroll/generate` | Blocked if over budget |
| PATCH | `/payroll/{id}/lock` | Super Admin only |
| GET/POST/PUT | `/budget[/{id}]` | Write: Super Admin only |
| GET/PUT | `/payroll-rules[/{id}]` | Write: Super Admin only |
| GET | `/reports/templates` | |
| GET | `/reports/{template}/export` | CSV download |
| GET/PUT | `/settings` | Write: Super Admin only |
| GET | `/audit-logs` | Super Admin only |

## Suggested next steps

1. Add PHPUnit/Pest feature tests for the approval stepper and budget-blocking logic — those are the highest-risk business rules.
2. Wire the `barryvdh/laravel-dompdf` package (already in `composer.json`) into `ReportController` for PDF export alongside CSV.
3. If devices push attendance in real time, add a queued `ProcessDeviceSyncJob` behind `/attendance` with `source=api_sync`.
4. Add `laravel/reverb` or Pusher if you want the notification bell to update live instead of on next fetch.
