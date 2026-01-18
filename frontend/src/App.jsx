import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/students"
        element={
          <PrivateRoute>
            <MainLayout>
              <div>Students Page - Coming Soon</div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/leads"
        element={
          <PrivateRoute>
            <MainLayout>
              <div>Leads Page - Coming Soon</div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <MainLayout>
              <div>Attendance Page - Coming Soon</div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/exams"
        element={
          <PrivateRoute>
            <MainLayout>
              <div>Exams Page - Coming Soon</div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/fees"
        element={
          <PrivateRoute>
            <MainLayout>
              <div>Fees Page - Coming Soon</div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <PrivateRoute>
            <MainLayout>
              <div>Staff Page - Coming Soon</div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/branches"
        element={
          <PrivateRoute>
            <MainLayout>
              <div>Branches Page - Coming Soon</div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
