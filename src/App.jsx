// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme/theme';
import { authService } from './entities/users/authService';
import Login from './entities/users/Login';
import Register from './entities/users/Register';
import Dashboard from './entities/DashBoard';

function App() {
  useEffect(() => {
    // Manejar callback de Google
    if (authService.handleGoogleCallback()) {
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    }
  }, []);

  const token = authService.getToken();

  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={token ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={token ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={token ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={token ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;