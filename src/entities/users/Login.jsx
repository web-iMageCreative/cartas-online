// src/pages/auth/Login.jsx
import { useEffect, useState } from 'react';
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
} from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { AuthService } from './AuthService';
import { NotificationService } from '../../shared/NotificationService';
import { useNavigate } from 'react-router-dom';
// Do not import the static theme object here; use runtime theme from MantineProvider instead

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkToken = () => {
    const token = AuthService.getToken();
    if (token) navigate('/dashboard');
  };

  useEffect(() => checkToken(), []);

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
      const result = await AuthService.login(values.email, values.password);
      if (result.success) {
        NotificationService.success('Bienvenido de nuevo', {
          title: 'Usuario identificado correctamente',
        });
        navigate('/dashboard');
      } else {
        NotificationService.error('Error al iniciar sesión', {
          title: 'Usuario no identificado',
        });
        form.setErrors({ email: result.message });
      }
    } catch (error) {
      NotificationService.error('Error al iniciar sesión', {
        title: 'Usuario no identificado',
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const url = await AuthService.getGoogleLoginUrl();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error al iniciar Google Login:', error);
    }
  };

  return (
      <Paper withBorder shadow="md" p={30} radius="md" style={{ width: 420 }}>
        <Title order={2} ta="center" mb="xs">
          Kamarero.es
        </Title>
        <Title className="form-title" order={3} c="dimmed" ta="center" mb="lg">
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
              variant='filled'
              type="submit" 
              loading={loading} 
              fullWidth
              c="brand.3"
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
  );
}