# Laravel Backend Setup Guide

## Prerequisites

- PHP 8.1 or higher
- Composer
- PostgreSQL 13 or higher
- Redis (optional, for caching and queues)

## Installation Steps

### 1. Install Dependencies

```bash
composer install
```

### 2. Environment Configuration

Copy the configured environment file:

```bash
cp .env.example.configured .env
```

Update the following variables in `.env`:

```
APP_NAME="Anabat SMS"
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=anabat_sms
DB_USERNAME=postgres
DB_PASSWORD=your_password_here

FRONTEND_URL=http://localhost:3000
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Create Database

Create a PostgreSQL database named `anabat_sms`:

```sql
CREATE DATABASE anabat_sms;
```

### 5. Run Migrations

```bash
php artisan migrate
```

### 6. Seed Database

```bash
php artisan db:seed
```

This will create:
- Two branches (Main and Secondary)
- Roles and permissions
- Three test users:
  - Super Admin: admin@anabatsms.com / password
  - Branch Admin: branchadmin@anabatsms.com / password
  - Teacher: teacher@anabatsms.com / password

### 7. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- **POST** `/api/register` - Register new user
- **POST** `/api/login` - Login user
- **GET** `/api/me` - Get authenticated user (requires auth)
- **POST** `/api/logout` - Logout user (requires auth)
- **POST** `/api/refresh` - Refresh token (requires auth)

## Testing the API

### Login Request

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@anabatsms.com",
    "password": "password"
  }'
```

### Get User Profile

```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Roles

1. **Super Admin** - Full system access
2. **Branch Admin** - Branch-level administration
3. **Teacher** - Student and academic management
4. **Accountant** - Financial management
5. **Data Operator** - Data entry operations

## Next Steps

1. Configure SMS gateway settings in `.env`
2. Set up email service credentials
3. Configure AWS S3 for file storage (if needed)
4. Review and customize permissions as needed
5. Begin implementing additional modules

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Permission Issues

```bash
chmod -R 775 storage bootstrap/cache
```

### Clear Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```
