// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme/theme';
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
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;