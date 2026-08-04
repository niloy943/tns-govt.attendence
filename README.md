# Government Ministry HRMS & Attendance System

An enterprise-grade Human Resource Management System (HRMS) and Biometric Attendance Tracking solution customized for the Government of Bangladesh ministries, secretariats, and departments.

The repository is divided into two standalone, decoupled systems:
1. **Frontend**: React + Vite UI application with custom styles, charts, and API integration.
2. **Backend**: Laravel 11 REST API with SQLite database, Sanctum authentication, and business policy controls.

```
d:\tns-hrms\
├── frontend/    # React + Vite UI Application (Port 5173 / 3001)
└── backend/     # Laravel 11 REST API Application (Port 8000)
```

---

## 1. Frontend Setup (`/frontend`)

The frontend is built with React 18, React Router 6, TanStack React Query 5, and Lucide React icons.

### Setup and Running:
```powershell
cd frontend

# Install client packages
npm install

# Run Vite dev server (runs on port 5173 or 3001 depending on port availability)
npm run dev
```

- **Environment Config**: Set via [frontend/.env.local](file:///d:/tns-hrms/frontend/.env.local):
  - `VITE_API_BASE_URL=http://localhost:8000/api`
  - `VITE_USE_DUMMY_DATA=false` (Toggle to `true` to run purely on mock client-side data)

---

## 2. Backend Setup (`/backend`)

The backend is built with Laravel 11 and SQLite. It provides full API endpoints matching the React Query hooks.

### Setup and Database Seeding:
```powershell
cd backend

# 1. Allow dependency downloads and install vendors
$env:COMPOSER_POLICY_ADVISORIES_BLOCK="false"
composer install --ignore-platform-reqs

# 2. Recreate/initialize the SQLite database file
Remove-Item -Path database\database.sqlite -Force
New-Item -ItemType File -Path database\database.sqlite -Force

# 3. Refresh composer autoload mapping and configure .env
composer dump-autoload
cp .env.example .env
php artisan key:generate

# 4. Run migrations and seed data
php artisan migrate:fresh --seed

# 5. Start Laravel local server
php artisan serve
```

### Seeded Credentials (Password: `password`):
- **Super Admin**: `superadmin@tns.gov.bd` (Cross-ministry oversight)
- **Ministry Admin**: `admin.mof@tns.gov.bd` (Ministry of Finance Branch Manager)

---

## 3. Troubleshooting & Notes

- **Autoloader Errors**: If PHP throws a `Class "Database\Seeders\X" not found` error during migration, run `composer dump-autoload` in the `backend/` folder to reload cached class paths.
- **SQLite Database Corruption**: If you encounter `SQLSTATE[HY000]: General error: 26 file is not a database`, it means your SQLite file has bad initial characters. Recreate the empty file with:
  ```powershell
  Remove-Item -Path database\database.sqlite -Force
  New-Item -ItemType File -Path database\database.sqlite -Force
  php artisan migrate:fresh --seed
  ```
