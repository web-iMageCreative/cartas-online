import { useEffect, useState } from 'react';
import BusinessesService from './BusinessesService';
import { Container, Title, Stack, Paper, LoadingOverlay} from '@mantine/core';
import { NotificationService } from '../../shared/NotificationService';
import { AuthService } from '../users/AuthService';

export default function BusinessesList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const userData = AuthService.getCurrentUser();
      
      await BusinessesService.listBusinesses(userData.id)
        .then((data) => setBusinesses(data))
        .catch((error) => NotificationService.error(error, {title: 'Error cargando negocios'}))
        .finally(() => setLoading(false));
    };

    fetchBusinesses();
  }, []);

  return (
    <Container miw="450" pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0, blur: 2 }} />
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Mis negocios
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