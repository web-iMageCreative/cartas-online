// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@mantine/core/styles.css';
import { AuthService } from './entities/users/AuthService';
import AppRoutes from './Routes';

function App() {
  useEffect(() => {
    // Manejar callback de Google
    if (AuthService.handleGoogleCallback()) {
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    }
  }, []);

  return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
  );
}

export default App;