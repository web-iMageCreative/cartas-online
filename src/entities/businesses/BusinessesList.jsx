import { useEffect, useState } from 'react';
import BusinessesService from './BusinessesService';
import { Container, Title, Stack, Image, LoadingOverlay, Card, Group, Avatar, UnstyledButton, Text, Box} from '@mantine/core';
import { NotificationService } from '../../shared/NotificationService';
import { AuthService } from '../users/AuthService';
import { IconTrash, IconEdit, IconEye, IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';

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
    <Container maw="450" pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0, blur: 2 }} />
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Mis negocios
      </Title>

      <Stack gap="md">
        {businesses.map((business) => (
          <Card key={business.id} shadow="sm" padding="lg" withBorder>
            <Card.Section>
              <Image
                src={business.cover_image}
                height={160}
                alt="Norway"
              />
            </Card.Section>

            <Group justify='end' mt={-40} mb={-40}>
              <Avatar size="xl" src={business.logo} />
            </Group>

            <Box mt="lg" mb="lg">
              <Text mb="sm" fw={500}>{business.name}</Text>
              <Text mb="lg" size="sm" c="dimmed">
                {business.description}
              </Text>
              <Group align='start' justify="space-between" wrap='no-wrap'>
                <Text ta="center" fz="xs" fw={400}><IconMail /><br />{business.email}</Text>
                <Text ta="center" fz="xs" fw={400}><IconPhone /><br />{business.phone}</Text>
                <Text ta="center" fz="xs" fw={400}><IconMapPin /><br />{business.address}</Text>
              </Group>
            </Box>

            
            <Card.Section bg='custom.5'>
              <Group justify="space-around" mt="md" mb="md" ml="xl" mr="xl">
                <UnstyledButton ta="center" fz="xs" component="a" href={'/' + business.slug + '/'}><IconEye /><br/>Ver</UnstyledButton>
                <UnstyledButton ta="center" fz="xs" component="a" href={'/' + business.slug + '/update'}><IconEdit /><br/>Editar</UnstyledButton>
                <UnstyledButton ta="center" fz="xs" component="a" href={'/' + business.slug + '/delete'}><IconTrash /><br/>Eliminar</UnstyledButton>
              </Group>
            </Card.Section>           
          </Card>
        ))}
      </Stack>
    </Container>
  );
}