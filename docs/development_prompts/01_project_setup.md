# Phase 0: Project Setup Prompts

## Initialize Laravel Backend

```
I need to set up the Laravel backend for the Anabat School Management System. Please:

1. Create a new Laravel project in the backend directory
2. Set up the proper directory structure following Laravel best practices
3. Configure the .env file for PostgreSQL database connection
4. Set up JWT authentication with Laravel Sanctum
5. Create a basic authentication controller with login/register endpoints
6. Implement role-based access control with proper middleware
7. Set up database migrations for users, roles, and permissions tables
8. Configure CORS for API access from the React frontend
9. Add basic validation and error handling
10. Set up PHPUnit for testing
```

## Initialize React Frontend

```
I need to set up the React frontend for the Anabat School Management System. Please:

1. Create a new React application in the frontend directory using create-react-app or Vite
2. Set up the project structure (components, pages, services, store, utils)
3. Install and configure Material-UI for the design system
4. Set up React Router with proper routes configuration
5. Configure Redux Toolkit for state management
6. Create authentication slices and services
7. Implement a responsive layout with navigation
8. Set up Axios for API communication with interceptors for authentication
9. Create reusable UI components (buttons, forms, tables, modals)
10. Implement proper form validation with formik or react-hook-form
```

## Database Configuration

```
I need to set up the database architecture for the Anabat School Management System with multi-branch support. Please:

1. Create the PostgreSQL database schema with proper naming conventions
2. Design the database structure for multi-branch data segregation
3. Set up migrations for core tables (branches, users, roles, permissions)
4. Implement foreign key constraints and indexes for optimization
5. Create database seeders for initial data (roles, permissions, admin user)
6. Set up proper relationships between models in Laravel
7. Implement soft deletes for data integrity
8. Configure database transactions for critical operations
9. Set up database backup strategy
10. Create database diagrams for the core schema
```

## Docker Environment Setup

```
I need to set up a Docker environment for the Anabat School Management System. Please:

1. Create a Docker Compose configuration for development
2. Set up containers for PHP/Laravel, PostgreSQL, and Node.js
3. Configure volumes for persistent data
4. Set up environment variables for different services
5. Create development and production Docker configurations
6. Implement health checks for containers
7. Set up networking between containers
8. Configure Nginx as a web server and reverse proxy
9. Optimize Docker images for performance
10. Create scripts for common Docker operations
```
