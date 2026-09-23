import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from './entities/users/AuthService';
import Login from './entities/users/Login';
import Register from './entities/users/Register';
import ForgotPassword from './entities/users/ForgotPassword';
import ResetPassword from './entities/users/ResetPassword';
// import Dashboard from './entities/DashBoard';
import ProtectedRoute from './ProtectedRoute';
import BusinessesCreate from './entities/businesses/BusinessesCreate';
import BusinessesList from './entities/businesses/BusinessesList';
import BusinessPage from './entities/businesses/Businesses';
import BusinessesUpdate from './entities/businesses/BusinessesUpdate';
import MenuPage from './entities/menus/Menu';
import MenusCreate from './entities/menus/MenusCreate';
import MenusUpdate from './entities/menus/MenusUpdate';
import MenusList from './entities/menus/MenusList';
import PublicLayout from './layouts/PublicLayouts';
import PrivateLayout from './layouts/PrivateLayouts';
import CategoriesCreate from './entities/categories/CategoriesCreate';
import CategoriesList from './entities/categories/CategoriesList';
import CategoriesUpdate from './entities/categories/CategoriesUpdate';
import ItemsCreate from './entities/items/ItemsCreate';
import ItemsUpdate from './entities/items/ItemsUpdate';
import ItemsList from './entities/items/ItemsList';
import ItemsReadList from './entities/items/ItemsReadList';
import MenuReadList from './entities/menus/MenuReadList';

export default function AppRoutes() {
  const token = AuthService.getToken();

  return (
    <Routes>
      <Route element={<PrivateLayout />}>

        {/* <Route path="/Inicio/"
          element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } 
        /> */}


        <Route path="/negocios/"
          element={ <ProtectedRoute><BusinessesList /></ProtectedRoute> } 
        />

        <Route path="/:business_slug/"
          element={ <ProtectedRoute><BusinessPage /></ProtectedRoute>} 
        />

        <Route path="/negocios/crear/"
          element={ <ProtectedRoute><BusinessesCreate /></ProtectedRoute> } 
        />

        <Route path="/:business_slug/editar/"
          element={ <ProtectedRoute><BusinessesUpdate /></ProtectedRoute> } 
        />


        <Route path="/:business_slug/menus/"
          element={ <ProtectedRoute><MenusList /></ProtectedRoute> } 
        />

        <Route path="/:business_slug/:menu_slug/"
          element={ <ProtectedRoute><MenuPage /></ProtectedRoute> } 
        />

        <Route path="/:business_slug/menus/crear/"
          element={ <ProtectedRoute><MenusCreate /></ProtectedRoute> } 
        />

        <Route path="/:business_slug/:menu_slug/editar/"
          element={ <ProtectedRoute><MenusUpdate /></ProtectedRoute> } 
        />


        <Route path="/:business_slug/:menu_slug/categorias/"
          element={ <ProtectedRoute><CategoriesList /></ProtectedRoute> } 
        />

        <Route path="/:business_slug/:menu_slug/categorias/crear/"
          element={ <ProtectedRoute><CategoriesCreate /></ProtectedRoute> } 
        />

        <Route path="/:business_slug/:menu_slug/categorias/editar/:category_id/"
          element={ <ProtectedRoute><CategoriesUpdate /></ProtectedRoute> } 
        />


        <Route path="/:business_slug/:menu_slug/productos/"
          element={ <ProtectedRoute><ItemsList /></ProtectedRoute> } 
        />

        <Route path="/:business_slug/:menu_slug/productos/crear/"
          element={ <ProtectedRoute><ItemsCreate /></ProtectedRoute> } 
        />

        <Route path="/:business_slug/:menu_slug/productos/editar/:item_id/"
          element={ <ProtectedRoute><ItemsUpdate /></ProtectedRoute> } 
        />

      </Route>
      <Route element={<PublicLayout />}>
        <Route path="/"                                            element={ <Navigate to={token ? "/negocios" : "/login"} replace /> } />
        <Route path="/login"                                       element={ <Login /> } />
        <Route path="/register"                                    element={ <Register /> } />
        <Route path="/forgot-password"                             element={ <ForgotPassword /> } />
        <Route path="/reset-password/:hash"                        element={ <ResetPassword /> } />
        <Route path="/:business_slug/carta/:menu_slug/"
          element={ <ItemsReadList /> } 
        />
        <Route path="/:business_slug/carta/"
          element={ <MenuReadList /> }
          />
      </Route>
    </Routes>
  );
}