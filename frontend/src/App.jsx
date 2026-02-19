import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import BranchManagement from './pages/admin/BranchManagement';
import UserManagement from './pages/admin/UserManagement';
import UserProfile from './pages/profile/UserProfile';
import LeadList from './pages/leads/LeadList';
import LeadForm from './pages/leads/LeadForm';
import LeadDetails from './pages/leads/LeadDetails';
import LeadAnalytics from './pages/leads/LeadAnalytics';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
              <LeadList />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/leads/new"
        element={
          <PrivateRoute>
            <MainLayout>
              <LeadForm />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/leads/analytics"
        element={
          <PrivateRoute>
            <MainLayout>
              <LeadAnalytics />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/leads/:id"
        element={
          <PrivateRoute>
            <MainLayout>
              <LeadDetails />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/leads/:id/edit"
        element={
          <PrivateRoute>
            <MainLayout>
              <LeadForm />
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
              <BranchManagement />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/branches"
        element={
          <PrivateRoute>
            <MainLayout>
              <BranchManagement />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <PrivateRoute>
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <MainLayout>
              <UserProfile />
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
