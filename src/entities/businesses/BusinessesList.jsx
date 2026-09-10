import { useEffect, useState } from 'react';
import BusinessesService from './BusinessesService';
import { Container, Title, Stack, Paper} from '@mantine/core';
import { NotificationService } from '../../shared/NotificationService';
import { AuthService } from '../users/AuthService';

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost';

export default function BusinessesList() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const userData = AuthService.getCurrentUser();
      
      await BusinessesService.listBusinesses(userData.id)
        .then((data) => {
          setBusinesses(data);
        })
        .catch((error) => {
          NotificationService.error('No encontramos ningún negocio con ese ID: ' + error, {
            title: 'Error cargando negocios',
          });
        });
    };

    fetchBusinesses();
  }, []);

  return (
    <Container size="sm">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Mis negocios:
      </Title>

      <Stack gap="md">
        {businesses.map((business) => (
          <Paper p="lg" key={business.id}>
            {business.cover_image &&
              <img
                src={business.cover_image}
                alt={'portada de ' + business.name}
              />
            }
            <Title order={4} c="custom.0" mb="xs">
              {business.name}
            </Title>
            {business.description && <p>{business.description}</p>}
            {business.email && <p>{business.email}</p>}
            {business.address && <p>{business.address}</p>}
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}