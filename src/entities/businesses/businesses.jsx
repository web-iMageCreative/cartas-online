import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Group, LoadingOverlay, Card, Avatar, Stack, Text, Title, Image, Box } from '@mantine/core';
import BusinessesServices from './BusinessesService';
import { NotificationService } from '../../shared/NotificationService';
import MenuList from '../menus/MenusList';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';

export default function BusinessPage() {
  const { business_slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusiness = async () => {
      setLoading(true);

      await BusinessesServices.getBusinessBySlug(business_slug)
        .then((data) => setBusiness(data))
        .catch((error) => NotificationService.error(error.message, { title: 'Error al cargar negocio' }))
        .finally(() => setLoading(false));
    };

    if (business_slug) loadBusiness();
  }, [business_slug]);

  if (!business) {
    return (
      <Container maw="450" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0, blur: 2 }} />
        <Text>No se encontró el negocio.</Text>
      </Container>
    );
  }

  return (
    <Container maw="450" pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0, blur: 2 }} />

      <Title order={2} c="custom.0" ta="center" mb="lg">{business.name} </Title>
      <Stack gap="md" mb="xl">
        <Card key={business.id} shadow="sm" padding="lg" withBorder>
          <Card.Section pos="relative">
            <Group justify='center' align='center'>
              <Image
                src={business.cover_image || '/src/assets/imgs/business-dummy.jpg'}
                height={160}
                alt={business.name || 'Portada'}
              />
              {!(business.cover_image && business.cover_image.trim()) && (
              <Text style={{textTransform: 'uppercase', letterSpacing:'5px'}} c="custom.1" pos="absolute">{business.name}</Text>
              )}
            </Group>
          </Card.Section>

          <Group justify='end' mt={-40} mb={-40}>
            {business.logo && business.logo.trim() ? (
              <Avatar size="xl" src={business.logo} />
            ) : (
              <Avatar color="custom.2" size="xl" styles={{ placeholder: { fontSize: '1rem' } }} name={business.name} />
            )}
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
        </Card>
      </Stack>
      
      <MenuList businessSlug={business.slug} />
    </Container>
  );
}