# Anabat SMS - Quick Start Guide

## Backend Setup (Laravel)

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Configure Environment
```bash
cp .env.example.configured .env
# Edit .env and update database credentials
```

### 3. Setup Database
```bash
# Create PostgreSQL database
createdb anabat_sms

# Run migrations
php artisan migrate

# Seed initial data
php artisan db:seed
```

### 4. Start Backend Server
```bash
php artisan serve
# Backend runs at http://localhost:8000
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@anabatsms.com", "password": "password"}'
```

## Frontend Setup (React) - ✅ COMPLETED

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Default API URL is already set to http://localhost:8000/api
```

### 3. Start Frontend Server
```bash
npm run dev
# Frontend runs at http://localhost:3000
```

### Test the Application
1. Open browser to `http://localhost:3000`
2. Login with: `admin@anabatsms.com` / `password`
3. You should see the dashboard after successful login

## Default Test Users

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@anabatsms.com | password |
| Branch Admin | branchadmin@anabatsms.com | password |
| Teacher | teacher@anabatsms.com | password |

## Available API Endpoints

- `POST /api/register` - Register user
- `POST /api/login` - Login
- `GET /api/me` - Get user profile (auth required)
- `POST /api/logout` - Logout (auth required)
- `POST /api/refresh` - Refresh token (auth required)

## Project Structure

```
anabat_sms/
├── backend/              # Laravel API (✅ COMPLETED)
├── frontend/             # React App (✅ COMPLETED)
├── docs/                 # Documentation
│   ├── architecture.md
│   ├── database_schema.md
│   ├── PHASE_0_COMPLETE.md
│   └── development_prompts/
│       ├── 00_index.md
│       ├── 01_project_setup.md
│       ├── 02_core_system.md
│       ├── 03_academic_management.md
│       ├── 04_financial_management.md
│       ├── 05_staff_and_resources.md
│       └── 06_reporting_and_optimization.md
└── docker-compose.yml
```

## Next Development Phase

**Phase 1: Core System** - Use prompts from `docs/development_prompts/02_core_system.md`

1. Multi-Branch Configuration UI
2. User Management Interface  
3. Admissions Module (Lead Management)
4. Student Basic Module

## Useful Commands

### Backend
```bash
# Clear cache
php artisan config:clear
php artisan cache:clear

# Run tests
php artisan test

# Create new migration
php artisan make:migration create_table_name

# Create new model
php artisan make:model ModelName -m

# Create new controller
php artisan make:controller ControllerName
```

## Documentation

- **Setup Guide**: `backend/SETUP.md`
- **Architecture**: `docs/architecture.md`
- **Database Schema**: `docs/database_schema.md`
- **Phase 0 Summary**: `docs/PHASE_0_COMPLETE.md`
- **Development Prompts**: `docs/development_prompts/`

## Support

For issues or questions, refer to the documentation in the `docs` directory.
