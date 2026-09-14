import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge, Container, Group, Paper, LoadingOverlay, Card,  Avatar, Stack, Text, Title, Image, Box } from '@mantine/core';
import BusinessesServices from './BusinessesService';
import { NotificationService } from '../../shared/NotificationService';
import MenuList from '../menus/MenusList';
import { IconTrash, IconEdit, IconEye, IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';

export default function BusinessPage() {
  const { business_slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBusiness = async () => {
      setLoading(true);

      try {
        const data = await BusinessesServices.getBusinessBySlug(business_slug);
        setBusiness(data);
        console.log("Negocio cargado:", data);
      } catch (error) {
        NotificationService.error(error.message || 'No se pudo cargar el negocio', {
          title: 'Error al cargar negocio',
        });
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    };

    if (business_slug) {
      loadBusiness();
    } 
  }, [business_slug]);

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Text>Cargando negocio...</Text>
      </Container>
    );
  }

  if (!business) {
    return (
      <Container size="lg" py="xl">
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
            </Card>
      </Stack>
      <MenuList businessSlug={business.slug} />
    </Container>
  );
}