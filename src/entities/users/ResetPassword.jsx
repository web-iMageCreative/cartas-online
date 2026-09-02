import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Paper, Title, Stack, PasswordInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { authService } from './authService';
import { notificationService } from '../../shared/notificationService';
import { theme } from '../../theme/theme';

export default function ResetPassword() {
   const [loading, setLoading] = useState(false);
   const Navigate = useNavigate();
   const { hash } = useParams();
   const form = useForm({
      initialValues: {
         password: '',
         password_repeat: ''
      },
      validate: {
         password: (value) => {
            if (!value || value.trim().length < 6) {
               return 'La contraseña debe tener al menos 6 caracteres';
            }
            return null;
         },
         password_repeat: (value, values) => {
            if (!value || value.trim().length < 6) {
               return 'La contraseña debe tener al menos 6 caracteres';
            }
            if (value !== values.password) {
               return 'Las contraseñas no coinciden';
            }
            return null;
         }
      },
      validateInputOnChange: ['password', 'password_repeat'],
   });
   
   useEffect(() => {
      if (!hash) {
         notificationService.error('El enlace de restablecimiento de contraseña no es válido.', {
            title: 'Error',
         });
         Navigate('/login');
      } else {
         console.log(hash)
         authService.verifyResetPasswordHash(hash)
          .then(result => {
            if (!result.success) {
               notificationService.error('El enlace de restablecimiento de contraseña no es válido.', {
                  title: 'Error',
               });
               Navigate('/login');
            }
         });
      }

   }, []);

   const handleSubmit = async (values) => {
      const validation = form.validate();
      if (validation.hasErrors) {
         return;
      }

      setLoading(true);

      try { 
         const result = await authService.resetPassword(hash,values.password, values.password_repeat);
         if (result.success) {
            notificationService.success('Contraseña restablecida correctamente.', {
               title: 'Contraseña actualizada',
            });
            Navigate('/login');
         } else {
            notificationService.error('Error al enviar el correo de recuperación de contraseña: ' + result.message, {
               title: 'Error al solicitar recuperación de contraseña',
            });
         }
      } catch (error) {
         notificationService.error(error.message, {
            title: 'Error',
         });
         console.log('Error:', error);
      } finally {
         setLoading(false);
      }
   }

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
               Reiniciar contraseña
            </Title>
    
            <form onSubmit={form.onSubmit(handleSubmit)}>
               <Stack gap="md">
                  <PasswordInput
                     label="Contraseña"
                     placeholder="Contraseña"
                     {...form.getInputProps('password')}
                  />
                  <PasswordInput
                     label="Repetir contraseña"
                     placeholder="Repite la contraseña"
                     {...form.getInputProps('password_repeat')}
                  />
                  <Button 
                     type="submit" 
                     loading={loading} 
                     disabled={!form.isValid()} 
                     fullWidth
                     c={theme.colors.brand[3]}
                  >
                     Recuperar contraseña
                  </Button>
               </Stack>
            </form>
         </Paper>
      </Box>
 );
}