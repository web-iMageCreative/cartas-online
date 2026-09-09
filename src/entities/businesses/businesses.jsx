import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge, Container, Group, Menu, Paper, Stack, Text, Title } from '@mantine/core';
import BusinessesServices from './BusinessesService';
import { NotificationService } from '../../shared/NotificationService';
import MenuList from '../menus/MenusList';

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
    <Container size="lg" py="xl">
      <Paper withBorder radius="md" p="xl" mb="xl">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <div>
            <Title order={2} c="custom.0">{business.name}</Title>
            <Text c="dimmed" mt="xs">{business.slug}</Text>
          </div>

          <Badge
            size="lg"
            variant="light"
            color={business.is_active ? 'green' : 'gray'}
          >
            {business.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        </Group>

        <Stack gap="sm" mt="lg">
          {business.description && <Text>{business.description}</Text>}
          {business.address && (
            <Text>
              <strong>Dirección:</strong> {business.address}
            </Text>
          )}
          {business.email && (
            <Text>
              <strong>Email:</strong> {business.email}
            </Text>
          )}
          {business.phone && (
            <Text>
              <strong>Teléfono:</strong> {business.phone}
            </Text>
          )}
              {business.logo && <img src={business.logo} alt="Logo" />}
            {business.cover_image && <img src={business.cover_image} alt="Imagen de portada" />}
        </Stack>
      </Paper>

      <Title order={3} mb="md" c="custom.0">
        Menú
      </Title>

      <MenuList businessSlug={business.slug} />
    </Container>
  );
}