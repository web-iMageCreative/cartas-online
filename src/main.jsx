import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css'
import App from './App.jsx'
import { theme } from './theme/theme';
import { Box } from '@mantine/core';

createRoot(document.getElementById('root')).render(
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="bottom-center" />
      <Box 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundImage: 'url(./src/assets/imgs/app-bg.jpg)',
          border: 'none',
        }}
      >
      <App />
      </Box>
    </MantineProvider>
)