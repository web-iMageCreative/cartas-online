import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { 
  Container, 
  Title, 
  Stack, 
  LoadingOverlay,
  Group, 
  Button, 
  UnstyledButton, 
  Text, 
  Box, 
  Modal,
  Paper,
  ActionIcon
} from '@mantine/core';
import { 
  IconTrash,
  IconEdit,
  IconFolderPlus,
  IconArrowUp,
  IconArrowDown 
} from '@tabler/icons-react';
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

      if (menuData?.id) {
        const categoriesData = await CategoriesService.getCategoriesByMenuId(menuData.id);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      }
    } catch (error) {
      console.error(error);
      NotificationService.error(error, { title: 'Error al cargar las categorías' });
    } finally {
      setLoading(false);
    }
  };

  if (menu_slug) {
    fetchCategoriesData();
  }
}, [menu_slug]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setLoading(true);

      await CategoriesService.getCategoriesByMenuId(menu.id)
        .then((data) => {
          console.log(data);
          setCategories(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (menu) {
      fetchCategoriesData();
    }
  }, [menu]);

  const changeOrder = (direction) => {
    console.log(direction);
  }

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
    <Container maw={450} miw={300} pos="relative">
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
      >
        Crear nueva categoría
      </Button>

      <Stack gap="md">
        {categories.length === 0 && !loading && (
          <Text ta="center" size="sm" c="dimmed">
            No hay categorías registradas.
          </Text>
        )}

        {categories.map((category) => (
          <>
          <Paper pl="xs" py="xs" pr="md">
            <Group justify="space-between">
              <Stack gap="xs">
                <ActionIcon variant="light" onClick={() => changeOrder(1)}><IconArrowUp size="1rem" /></ActionIcon>
                <ActionIcon variant="light" onClick={() => changeOrder(-1)}><IconArrowDown size="1rem" /></ActionIcon>
              </Stack>
              <Box>
                <Title order={3}>{category.name}</Title>
                <Text fz="xs">{category.description}</Text>
              </Box>
              <Group justify="flex-end">
                <UnstyledButton
                  ta="center"
                  fz="xs"
                  component="a"
                  href={`/${menu_slug}/categories/${category.id}/update`}
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
            </Group>
          </Paper>

          {category.subcategories.length !== 0 && (
            <Stack gap="sm" ml="md" style={{borderLeft: "1px solid #fff"}}>

              {category.subcategories.map((subcategory) => (
                <Paper py="xs" pl="xs" pr="md" ml="md" bg="custom.3">
                  <Group justify="space-between">
                    <Stack gap="xs">
                      <ActionIcon variant="light" onClick={() => changeOrder(1)}><IconArrowUp size="1rem"/></ActionIcon>
                      <ActionIcon variant="light" onClick={() => changeOrder(-1)}><IconArrowDown size="1rem"/></ActionIcon>
                    </Stack>
                    <Box>
                      <Title order={3}>{subcategory.name}</Title>
                      <Text fz="xs">{subcategory.description}</Text>
                    </Box>
                    <Group justify="flex-end">
                      <UnstyledButton
                        ta="center"
                        fz="xs"
                        component="a"
                        href={`/${menu_slug}/categories/${subcategory.id}/update`}
                      >
                        <IconEdit /><br />Editar
                      </UnstyledButton>
                      <UnstyledButton
                        ta="center"
                        fz="xs"
                        onClick={() => handleOpen(subcategory.id)}
                      >
                        <IconTrash /><br />Eliminar
                      </UnstyledButton>
                    </Group>
                  </Group>
                </Paper>
              ))}

            </Stack>
          )}
          </>          
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