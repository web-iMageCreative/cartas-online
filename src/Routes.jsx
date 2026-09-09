import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from './entities/users/AuthService';
import Login from './entities/users/Login';
import Register from './entities/users/Register';
import ForgotPassword from './entities/users/ForgotPassword';
import ResetPassword from './entities/users/ResetPassword';
import Dashboard from './entities/DashBoard';
import ProtectedRoute from './ProtectedRoute';
import BusinessesCreate from './entities/businesses/BusinessesCreate';
// import BusinessesList from './entities/businesses/BusinessesList';
import BusinessPage from './entities/businesses/businesses';
import MenusCreate from './entities/menus/MenusCreate';
import PrivateLayout from './layouts/PrivateLayouts';
import PublicLayout from './layouts/PublicLayouts';
import MenusList from './entities/menus/MenusList';

export default function AppRoutes() {
  const token = AuthService.getToken();

  return (
    <Routes>
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard"                   element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } />
        <Route path="/businesses/create"           element={ <ProtectedRoute><BusinessesCreate /></ProtectedRoute> } />
        <Route path="/:business_slug" element={<ProtectedRoute><BusinessPage /></ProtectedRoute>} />
        <Route path="/:business_slug/menus/create" element={ <ProtectedRoute><MenusCreate /></ProtectedRoute> } />
        <Route path="/businesses/create/bussinesList"           element={ <ProtectedRoute><BusinessesCreate /></ProtectedRoute> } />
        <Route path="/:business_slug/menus" element= { <ProtectedRoute><MenusList /></ProtectedRoute> } />
      </Route>
      <Route element={<PublicLayout />}>
        <Route path="/"                            element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
        <Route path="/login"                       element={ <Login /> } />
        <Route path="/register"                    element={ <Register /> } />
        <Route path="/forgot-password"             element={ <ForgotPassword /> } />
        <Route path="/reset-password/:hash"        element={ <ResetPassword /> } />
      </Route>
    </Routes>
  );
}