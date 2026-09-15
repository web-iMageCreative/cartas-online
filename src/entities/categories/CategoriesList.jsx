import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { 
  Container, 
  Title, 
  Stack, 
  LoadingOverlay, 
  Card, 
  Group, 
  Button, 
  UnstyledButton, 
  Text, 
  Box, 
  Modal,
  Badge 
} from '@mantine/core';
import { IconTrash, IconEdit, IconFolderPlus, IconFolder } from '@tabler/icons-react';
import CategoriesService from './CategoriesService';
import MenuService from '../menus/MenusService';
import { NotificationService } from '../../shared/NotificationService';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { menu_slug } = useParams();

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setLoading(true);
      try {
        const menuData = await MenuService.getMenuBySlug(menu_slug);
        setMenu(menuData);

        const data = await CategoriesService.getCategoriesByMenuId(menuData.id);
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        NotificationService.error(error, { title: 'Error cargando categorías' });
      } finally {
        setLoading(false);
      }
    };

    if (menu_slug) {
      fetchCategoriesData();
    }
  }, [menu_slug]);

  const handleOpen = (id) => {
    setSelectedId(id);
    open();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await CategoriesService.deleteCategory(selectedId);
      setCategories((prev) => prev.filter((cat) => cat.id !== selectedId));
      NotificationService.success('Categoría eliminada con éxito', { title: 'Éxito' });
      close();
    } catch (error) {
      NotificationService.error(error, { title: 'Error eliminando categoría' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maw="450" pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0, blur: 2 }} />

      <Title order={3} c="custom.0" ta="center" mb="lg">
        Categorías {menu?.name ? `- ${menu.name}` : ''}
      </Title>

      <Button
        bg="custom.5"
        mb="xl"
        variant="outline"
        fullWidth
        leftSection={<IconFolderPlus size={18} />}
        ta="center"
        fz="xs"
        component="a"
        href={`/menus/${menu_slug}/categories/create`}
      >/
        Crear nueva categoría
      </Button>

      <Stack gap="md">
        {categories.length === 0 && !loading && (
          <Text ta="center" size="sm" c="dimmed">
            No hay categorías registradas.
          </Text>
        )}

        {categories.map((category) => (
          <Card key={category.id} shadow="sm" padding="lg" withBorder radius="md">
            <Box mb="sm">
              <Group justify="space-between" align="center" mb="xs">
                <Group gap="xs">
                  <IconFolder size={20} color="var(--mantine-color-custom-0)" />
                  <Text fw={600} size="md">
                    {category.name}
                  </Text>
                </Group>
                
                {category.parent && (
                  <Badge variant="light" color="gray" size="sm">
                    Subcategoría
                  </Badge>
                )}
              </Group>

              <Text size="sm" c="dimmed">
                {category.description || 'Sin descripción'}
              </Text>
            </Box>

            <Card.Section bg="custom.5">
              <Group justify="space-around" mt="sm" mb="sm" ml="xl" mr="xl">
                <UnstyledButton
                  ta="center"
                  fz="xs"
                  component="a"
                  href={`/menus/${menu_slug}/categories/${category.id}/update`}
                > 
                  <IconEdit /><br />Editar
                </UnstyledButton>
                <UnstyledButton
                  ta="center"
                  fz="xs"
                  onClick={() => handleOpen(category.id)}
                >
                  <IconTrash /><br />Eliminar
                </UnstyledButton>
              </Group>
            </Card.Section>
          </Card>
        ))}
      </Stack>

      <Modal opened={opened} onClose={close} title="Confirmar eliminación" centered>
        <Text size="sm">¿Estás seguro de que deseas eliminar esta categoría?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={close}>Cancelar</Button>
          <Button color="red" onClick={handleDelete}>Eliminar</Button>
        </Group>
      </Modal>
    </Container>
  );
}