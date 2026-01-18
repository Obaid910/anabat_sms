# Anabat SMS - Frontend

React frontend application for the Anabat School Management System.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form validation

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

Update `.env` with your API URL (default: `http://localhost:8000/api`)

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── TextField.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   └── Loading.jsx
│   ├── layout/          # Layout components
│   │   ├── MainLayout.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   └── auth/            # Authentication components
│       └── PrivateRoute.jsx
├── pages/
│   ├── auth/            # Authentication pages
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   └── dashboard/       # Dashboard pages
│       └── Dashboard.jsx
├── services/            # API services
│   ├── api.js           # Axios instance with interceptors
│   └── authService.js   # Authentication service
├── store/               # Redux store
│   ├── store.js         # Store configuration
│   └── slices/          # Redux slices
│       └── authSlice.js
├── styles/              # Global styles
│   ├── theme.js         # MUI theme configuration
│   └── index.css        # Global CSS
├── utils/               # Utility functions
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## Features

### Authentication
- Login with email and password
- Token-based authentication
- Auto-redirect for authenticated users
- Protected routes
- User registration is admin-only (no public signup)

### UI Components
- Responsive layout with sidebar navigation
- Material-UI themed components
- Reusable form components with validation
- Loading states
- Error handling

### State Management
- Redux Toolkit for global state
- Authentication state management
- Async thunk actions for API calls

### API Integration
- Axios instance with request/response interceptors
- Automatic token injection
- Error handling and redirects
- API service layer

## Default Test Credentials

After backend seeding, you can login with:

- **Super Admin**: admin@anabatsms.com / password
- **Branch Admin**: branchadmin@anabatsms.com / password
- **Teacher**: teacher@anabatsms.com / password

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:8000/api)

## Development

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/layout/Sidebar.jsx`

### Adding New API Services

1. Create service file in `src/services/`
2. Import and use the configured `api` instance
3. Create Redux slice if needed for state management

### Form Validation

Forms use React Hook Form for validation:

```jsx
const { register, handleSubmit, formState: { errors } } = useForm();

<TextField
  {...register('fieldName', {
    required: 'Field is required',
    minLength: { value: 3, message: 'Min 3 characters' }
  })}
  error={errors.fieldName?.message}
/>
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Next Steps

- Implement remaining pages (Students, Leads, Attendance, etc.)
- Add data tables with pagination and filtering
- Implement file upload functionality
- Add real-time notifications
- Implement advanced reporting features
