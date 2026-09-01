import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './entities/users/Login';
import Register from './entities/users/Register';
import ForgotPassword from './entities/users/Forgot-password';
import Dashboard from './entities/DashBoard';
import { authService } from './entities/users/authService';

export default function AppRoutes() {
  const token = authService.getToken();

  const routes = [
    { path: "/login", element: <Login />, isPublic: true },
    { path: "/register", element: <Register />, isPublic: true },
    { path: "/forgot-password", element: <ForgotPassword />, isPublic: true },
    { path: "/dashboard", element: <Dashboard />, isPublic: false },
    { path: "/", element: <Navigate to={token ? "/dashboard" : "/login"} />, isPublic: true },
  ];

  const checkAuth = (isPublic) => {
    const token = authService.getToken();
    return isPublic || token;
  };

  return (
    <Routes>
      {routes.map(({ path, element, isPublic }) => (
        <Route 
          key={path} 
          path={path} 
          element={checkAuth(isPublic) ? element : <Navigate to="/login" />} 
        />
      ))}
    </Routes>
  );
};