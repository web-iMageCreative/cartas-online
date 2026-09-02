import { useState } from 'react';
import { Box, Paper, Title, Stack, TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AuthService } from './AuthService';
import { NotificationService } from '../../shared/NotificationService';
import { theme } from '../../theme/theme';

export default function ForgotPassword() {
   const [loading, setLoading] = useState(false);
   const form = useForm({
      initialValues: {
         email: '',
      },
      validate: {
         email: (value) => {
            if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
               return 'Ingrese un email válido';
            }
            return null;
         },
      },
      validateInputOnChange: ['email'],
   });

   const handleSubmit = async (values) => {
      const validation = form.validate();
      if (validation.hasErrors) {
         return;
      }

      setLoading(true);

      try { 
         const result = await AuthService.forgotPassword(values.email);
         if (result.success) {
            NotificationService.success('Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.', {
               title: 'Correo de recuperación enviado',
            });
         } else {
            NotificationService.error('Error al enviar el correo de recuperación de contraseña: ' + result.message, {
               title: 'Error al solicitar recuperación de contraseña',
            });
         }
      } catch (error) {
         NotificationService.error(error.message, {
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
               Recuperar contraseña
            </Title>
    
            <form onSubmit={form.onSubmit(handleSubmit)}>
               <Stack gap="md">
                  <TextInput
                     label="Email"
                     placeholder="tu@email.com"
                     {...form.getInputProps('email')}
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