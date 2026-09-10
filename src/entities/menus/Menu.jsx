import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import MenusServices from './MenusService';
import { NotificationService } from '../../shared/NotificationService';
import MenuList from '../menus/MenusList';

export default function MenuPage() {
  const { menu_id } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);

      try {
        const data = await MenusServices.getMenuById(menu_id);
        setMenu(data);
        console.log("Menú cargado:", data);
      } catch (error) {
        NotificationService.error(error.message || 'No se pudo cargar el menú', {
          title: 'Error al cargar menú',
        });
        setMenu(null);
      } finally {
        setLoading(false);
      }
    };

    if (menu_id) {
      loadMenu();
    } 
  }, [menu_id]);

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Text>Cargando menú...</Text>
      </Container>
    );
  }

  if (!menu) {
    return (
      <Container size="lg" py="xl">
        <Text>No se encontró el menú.</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Paper withBorder radius="md" p="xl" mb="xl">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <div>
            <Title order={2} c="custom.0">{menu.name}</Title>
          </div>

          <Badge
            size="lg"
            variant="light"
            color={menu.is_active ? 'green' : 'gray'}
          >
            {menu.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        </Group>

        <Stack gap="sm" mt="lg">
          {menu.description && <Text>{menu.description}</Text>}
        </Stack>
      </Paper> 
    </Container>
  );
}