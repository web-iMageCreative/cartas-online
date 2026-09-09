import { useEffect, useState } from 'react';
import BusinessesService from './BusinessesService';
import { Container, Title, Stack, Paper, Image, Text } from '@mantine/core';
import { NotificationService } from '../../shared/NotificationService';
import { AuthService } from '../users/AuthService';

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost';

export default function BusinessesList() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const userData = AuthService.getCurrentUser();

        if (!userData || !userData.id) {
          throw new Error('No hay sesión de usuario activa');
        }

        const response = await BusinessesService.listBusinesses(userData.id);

        // Garantiza extraer siempre un arreglo, evitando que sea un objeto no mapeable
        const list = Array.isArray(response) ? response : (response?.data || []);
        setBusinesses(list);

      } catch (error) {
        NotificationService.error('Error cargando negocios: ' + error.message, {
          title: 'Error de carga',
        });
        setBusinesses([]); // Respaldo para asegurar que siempre sea un array
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <Container size="sm">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Mis negocios:
      </Title>

      <Stack gap="md">
        {Array.isArray(businesses) && businesses.length > 0 ? (
          businesses.map((business) => (
            <Paper p="lg" key={business.id} withBorder shadow="xs">
              <Stack gap="sm">
                {business.cover_image && (
                  <Image
                    src={`${API_HOST}/${business.cover_image}`}
                    alt={`Portada de ${business.name}`}
                    h={160}
                    radius="md"
                    fallbackSrc="https://placehold.co/600x400?text=Sin+Imagen"
                  />
                )}
                <div>
                  <Title order={4} c="custom.0" mb="xs">
                    {business.name}
                  </Title>
                  <Text size="sm" c="dimmed" mb="xs">{business.description}</Text>
                  <Text size="xs"><b>Email:</b> {business.email}</Text>
                  <Text size="xs"><b>Dirección:</b> {business.address}</Text>
                </div>
              </Stack>
            </Paper>
          ))
        ) : (
          <Text ta="center" c="dimmed">
            No tienes negocios registrados aún.
          </Text>
        )}
      </Stack>
    </Container>
  );
}