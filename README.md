# Government Ministry HRMS & Attendance System

This repository is organized into two standalone applications:

```
d:\tns-hrms\
├── frontend/    # React + Vite UI Application (Port 5173)
└── backend/     # Laravel 11 REST API Application (Port 8000)
```

---

## 1. Frontend Setup (`/frontend`)

```powershell
cd frontend
npm install
npm run dev
```
- App runs at: `http://localhost:5173`
- Configured via `frontend/.env.local` to talk to backend API at `http://localhost:8000/api`.

---

## 2. Backend Setup (`/backend`)

```powershell
cd backend

# Install dependencies (ignoring missing php-gd extension if running XAMPP)
$env:COMPOSER_POLICY_ADVISORIES_BLOCK="false"
composer install --ignore-platform-reqs

# Environment & Key
cp .env.example .env
php artisan key:generate

# Database Migration & Seed
php artisan migrate --seed

# Start API Server
php artisan serve
```
- API runs at: `http://localhost:8000/api`
