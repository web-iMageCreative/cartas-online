import { useEffect, useState } from 'react';
import BusinessesService from './BusinessesService';
import { Container, Title, Stack, Paper, Group } from '@mantine/core';
import { NotificationService } from '../../shared/NotificationService';
import { AuthService } from '../users/AuthService';

export default function BusinessesList() {
  const [userId, setUserId] = useState(null);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      await BusinessesService.listBusinesses(userId)
        .then((data) => {
          setBusinesses(data);
        })
        .catch((error) => {
          NotificationService.error('No encontramos ningún negocio con ese slug: ' + error, {
            title: 'Error cargando negocios',
          });
        });
    };

    AuthService.getCurrentUser()
      .then((userData) => {
        setUserId(userData.id);
        fetchBusinesses();
      })
      .catch((error) => {
        NotificationService.error('Error al obtener datos del usuario: ' + error, {
          title: 'Error',
        });
      });

    
  }, []);

  return (
    <Container miw="450">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Mis negocios:
      </Title>
      <Stack gap="md">
        {businesses.map((business) => (
          <Paper p="lg" key={business.id}>
            <Stack>
              <Group>
                <img
                  src={business.cover_image}
                  alt={'portada de ' + business.name}
                />
              </Group>
              <Group>
                <Title order={4} c="custom.0" mb="xs">
                  {business.name}
                </Title>
                <p>{business.description}</p>
                <p>{business.email}</p>
                <p>{business.address}</p>
              </Group>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Container>
  );

}