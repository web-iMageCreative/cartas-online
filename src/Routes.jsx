import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './entities/users/Login';
import Register from './entities/users/Register';
import ForgotPassword from './entities/users/ForgotPassword';
import ResetPassword from './entities/users/ResetPassword';
import Dashboard from './entities/DashBoard';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './entities/users/authService';

export default function AppRoutes() {
  const token = authService.getToken();

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
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}