// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Title, 
  Stack, 
  Divider,
  Group,
  Box,
} from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { authService } from './authService';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme/theme';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      password: (value) => (value.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await authService.login(values.email, values.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        form.setErrors({ email: result.message });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const url = await authService.getGoogleLoginUrl();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error al iniciar Google Login:', error);
    }
  };

  return (
    <Box 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        // backgroundColor: '#f8f9fa',
        border: 'none',
      }}
    >
      <Paper withBorder shadow="md" p={30} radius="md" style={{ width: 420 }}>
        <Title order={2} ta="center" mb="xs">
          🍽️ Cartas Online
        </Title>
        <Title order={3} c="dimmed" ta="center" mb="lg">
          Iniciar sesión
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="tu@email.com"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Contraseña"
              placeholder="Tu contraseña"
              {...form.getInputProps('password')}
            />

            <Button 
              type="submit" 
              loading={loading} 
              fullWidth
              c={theme.colors.brand[3]}
            >
              Iniciar sesión
            </Button>
          </Stack>
        </form>

        <Divider 
          label="O continuar con" 
          labelPosition="center" 
          my="lg" 
        />

        <Button
          variant="outline"
          fullWidth
          leftSection={<IconBrandGoogle size={18} />}
          onClick={handleGoogleLogin}
        >
          Google
        </Button>

        <Group justify="center" mt="lg">
          <Button variant="subtle" size="sm" component="a" href="/register">
            ¿No tienes cuenta? Regístrate
          </Button>
        </Group>

        <Group justify="center" mt="xs">
          <Button variant="subtle" size="sm" component="a" href="/forgot-password">
            ¿Olvidaste tu contraseña?
          </Button>
        </Group>
      </Paper>
    </Box>
  );
}