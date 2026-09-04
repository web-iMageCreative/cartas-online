import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './entities/users/Login';
import Register from './entities/users/Register';
import ForgotPassword from './entities/users/ForgotPassword';
import ResetPassword from './entities/users/ResetPassword';
import Dashboard from './entities/DashBoard';
import ProtectedRoute from './ProtectedRoute';
import BusinessesCreate from './entities/businesses/BusinessesCreate';
import MenusCreate from './entities/menus/MenusCreate';
import { AuthService } from './entities/users/AuthService';

export default function AppRoutes() {
  const token = AuthService.getToken();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:hash" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/businesses/create"
        element={
          <ProtectedRoute>
            <BusinessesCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:business_slug/menus/create"
        element={
          <ProtectedRoute>
            <MenusCreate />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}