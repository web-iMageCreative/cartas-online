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
  const { business_slug, menu_slug, category_id} = useParams();
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  //const { menu_slug } = useParams();

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
        .then( async (data) => {
          const categoriesWithOrder = Array.isArray(data) ? data.map((cat, index) => ({
            ...cat,
            display_order: index,
            subcategories: Array.isArray(cat.subcategories) ? cat.subcategories.map((subcat, subIndex) => ({
              ...subcat,
              display_order: subIndex
            })) : []
          })) : [];
          
          setCategories(categoriesWithOrder);

          await Promise.all(
            categoriesWithOrder.flatMap((cat) => {
              const categoryPromise = CategoriesService.syncCategoriesOrder(cat.id, cat.display_order);
              const subcategoryPromises = cat.subcategories.map((subcat) =>
                CategoriesService.syncCategoriesOrder(subcat.id, subcat.display_order)
              );
              return [categoryPromise, ...subcategoryPromises];
            })
          );
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

  const changeOrder = async (direction, categoryId, parentCategoryId) => {
    setLoading(true);

    try {
      // Si tiene parentCategoryId, es una subcategoría
      if (parentCategoryId) {
        // Encontrar la categoría padre
        const parentCategory = categories.find(cat => cat.id === parentCategoryId);
        if (!parentCategory) return;

        // Encontrar índice de la subcategoría
        const currentIndex = parentCategory.subcategories.findIndex(subcat => subcat.id === categoryId);
        if (currentIndex === -1) return;

        // Calcular nuevo índice
        const newIndex = direction === 1 ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= parentCategory.subcategories.length) return;

        const elements = document.querySelectorAll('.loop-element.subcategories');
        elements[currentIndex].classList.add(direction === 1 ? 'moving-up' : 'moving-down');
        elements[newIndex].classList.add(direction === 1 ? 'moving-down' : 'moving-up');

        // Espera a que termine la animación
        await new Promise(resolve => setTimeout(resolve, 300));

        // Intercambiar subcategorías
        const newCategories = categories.map(cat => ({
          ...cat,
          subcategories: cat.id === parentCategoryId ? [...cat.subcategories] : cat.subcategories
        }));

        const parentCat = newCategories.find(cat => cat.id === parentCategoryId);
        [parentCat.subcategories[currentIndex], parentCat.subcategories[newIndex]] = 
        [parentCat.subcategories[newIndex], parentCat.subcategories[currentIndex]];

        // Actualizar display_order de subcategorías
        parentCat.subcategories = parentCat.subcategories.map((subcat, index) => ({
          ...subcat,
          display_order: index
        }));

        setCategories(newCategories);

        // Sincronizar con BD
        await Promise.all(
          parentCat.subcategories.map((subcat) =>
            CategoriesService.syncCategoriesOrder(subcat.id, subcat.display_order)
          )
        )

        // Limpia las clases
        elements.forEach(el => {
          el.classList.remove('moving-up', 'moving-down');
        });
      } else {
        // Es una categoría principal
        const currentIndex = categories.findIndex(cat => cat.id === categoryId);
        if (currentIndex === -1) return;

        const newIndex = direction === 1 ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= categories.length) return;

        const elements = document.querySelectorAll('.loop-element.categories');
        elements[currentIndex].classList.add(direction === 1 ? 'moving-up' : 'moving-down');
        elements[newIndex].classList.add(direction === 1 ? 'moving-down' : 'moving-up');

        // Espera a que termine la animación
        await new Promise(resolve => setTimeout(resolve, 300));

        const newCategories = categories.map(cat => ({
          ...cat,
          subcategories: [...(cat.subcategories || [])]
        }));

        [newCategories[currentIndex], newCategories[newIndex]] = 
        [newCategories[newIndex], newCategories[currentIndex]];

        const updatedCategories = newCategories.map((cat, index) => ({
          ...cat,
          display_order: index
        }));

        setCategories(updatedCategories);

        await Promise.all(
          updatedCategories.map((cat) =>
            CategoriesService.syncCategoriesOrder(cat.id, cat.display_order)
          )
        );

        // Limpia las clases
        elements.forEach(el => {
          el.classList.remove('moving-up', 'moving-down');
        });
      }
    } catch (error) {
      console.error(error);
      NotificationService.error(error, { title: 'Error al cambiar el orden' });
    } finally {
      setLoading(false);
    }
  };

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
        href={`/${business_slug}/${menu_slug}/categorias/crear`}
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
          <Box className="loop-element categories" key={category.id}>
            <Paper pl="xs" py="xs" pr="md">
              <Group justify="space-between">
                <Stack gap="xs">
                  <ActionIcon className="order-arrow up" variant="light" onClick={() => changeOrder(1, category.id)}><IconArrowUp size="1rem" /></ActionIcon>
                  <ActionIcon className="order-arrow down" variant="light" onClick={() => changeOrder(-1, category.id)}><IconArrowDown size="1rem" /></ActionIcon>
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
                    href={`/${business_slug}/${menu_slug}/categorias/editar/${category.id}`}
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
              <Stack mt="md" gap="sm" ml="md" style={{borderLeft: "1px solid #fff"}}>

                {category.subcategories.map((subcategory) => (
                  <Paper key={subcategory.id} className="loop-element subcategories" py="xs" pl="xs" pr="md" ml="md" bg="custom.3">
                    <Group justify="space-between">
                      <Stack gap="xs">
                        <ActionIcon className="order-arrow up" variant="light" onClick={() => changeOrder(1, subcategory.id, category.id)}><IconArrowUp size="1rem"/></ActionIcon>
                        <ActionIcon className="order-arrow down" variant="light" onClick={() => changeOrder(-1, subcategory.id, category.id)}><IconArrowDown size="1rem"/></ActionIcon>
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
                          href={`/${business_slug}/${menu_slug}/categorias/editar/${category_id}`}
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
          </Box>      
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