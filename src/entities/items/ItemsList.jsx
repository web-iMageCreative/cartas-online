import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Container, Title, Stack, LoadingOverlay, Group, Button, Text, Box, Modal } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import ItemsService from './ItemsService';
import MenuService from '../menus/MenusService';
import { NotificationService } from '../../shared/NotificationService';
import { ReturnButton } from '../../shared/ReturnButton';
import ItemCard from './ItemCard';

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { menu_slug, business_slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await MenuService.getMenuBySlug(menu_slug)
        .then(async (menuData) => {
          setMenu(menuData);

          await ItemsService.getItemsByMenu(menuData.id)
            .then( async (itemsData) => { 
              const iTemsWithOrder = Array.isArray(itemsData) ? itemsData.map((cat) => ({
                ...cat,
                items: Array.isArray(cat.items) ? cat.items.map((item, index) => ({
                  ...item,
                  display_order: index
                })) : [],
                subcategories: Array.isArray(cat.subcategories) ? cat.subcategories.map((subcat) => ({
                  ...subcat,
                  items: Array.isArray(subcat.items) ? subcat.items.map((subItem, subIndex) => ({
                    ...subItem,
                    display_order: subIndex
                  })) : []
                })) : []
              })) : [];

              setItems(iTemsWithOrder);

              await Promise.all(
                iTemsWithOrder.flatMap((cat) => {
                  const itemsPromise = cat.items.map((item) => {
                    ItemsService.syncItemOrder(item.id, item.display_order);
                  });

                  const subItemsPromises = cat.subcategories.map((subcat) =>
                    subcat.items.map((subItem) => ItemsService.syncItemOrder(subItem.id, subItem.display_order))
                  );

                  return [itemsPromise, ...subItemsPromises];
                })
              );
            })
        })
        .catch((error) => {
          NotificationService.error(
            error.message || error,
            { title: 'Error al cargar el menú' }
          );
        })
        .finally(() => setLoading(false));
    };

    if (menu_slug) {
      fetchData();
    }
  }, [menu_slug]);

  const handleOpenDelete = (id) => {
    setSelectedId(id);
    open();
  };

  function removeItemFromCategories(categories, itemId) {
    return categories.map((category) => ({
      ...category,

      items: (category.items ?? []).filter(
        (item) => item.id !== itemId
      ),

      subcategories: removeItemFromCategories(
        category.subcategories ?? [],
        itemId
      )
    }));
  }

  const handleDelete = async () => {
    setLoading(true);

    await ItemsService.deleteItem(selectedId)
      .then(() => {
        setItems((prev) => removeItemFromCategories(prev, selectedId));

        NotificationService.success(
          'Artículo eliminado con éxito',
          { title: 'Éxito' }
        );

        close();
      })
      .catch((error) => {
        NotificationService.error(
          error.message || error,
          { title: 'Error eliminando artículo' }
        );
      })
      .finally(() => setLoading(false));
  };

  const changeOrder = async (direction, itemId, categoryId, subCategoryId) => {
    setLoading(true);

    try {
      let category;
      let elements;

      const newItems = items;

      if (subCategoryId) {
        // Encontrar la categoría padre
        const parentCategory = newItems.find(cat => cat.id === categoryId);
        if (!parentCategory) return;

        // Encontrar la subcategoría
        category = parentCategory.subcategories.find(subcat => subcat.id === subCategoryId);
        if (!category) return;

        elements = document.querySelectorAll('.loop-element.subitem');
      } else {
        category = newItems.find(cat => cat.id === categoryId);
        if (!category) return;

        elements = document.querySelectorAll('.loop-element.item');
      }

      const currentIndex = category.items.findIndex(item => item.id === itemId);
      if (currentIndex === -1) return;

      const newIndex = direction === 1 ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= category.items.length) return;

      // Animación
      elements[currentIndex].classList.add(direction === 1 ? 'moving-up' : 'moving-down');
      elements[newIndex].classList.add(direction === 1 ? 'moving-down' : 'moving-up');
      await new Promise(resolve => setTimeout(resolve, 300));

      [category.items[currentIndex], category.items[newIndex]] =
        [category.items[newIndex], category.items[currentIndex]];

      category.items = category.items.map((item, index) => ({
        ...item,
        display_order: index
      }));

      setItems([...newItems]);

      category.items.map( async (item) => {
        await ItemsService.syncItemOrder(item.id, item.display_order);
      });

      elements.forEach(el => {
        el.classList.remove('moving-up', 'moving-down');
      });
    } catch (error) {
      console.error('ERROR: ', error);
      NotificationService.error(error, { title: 'Error al cambiar el orden' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maw={480} miw={300} pos="relative" py="md">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0, blur: 2 }} />

        <ReturnButton url={`/${business_slug}/`} />

        <Title order={3} c="white" ta="center" mb="lg">
          Productos {menu?.name ? `- ${menu.name}` : ''}
        </Title>

        <Button
          bg="custom.5"
          mb="xl"
          variant="filled"
          fullWidth
          leftSection={<IconPlus size={18} />}
          ta="center"
          fz="xs"
          component={Link}
          to={`/${business_slug}/${menu_slug}/productos/crear`}
        >
          Crear nuevo producto
        </Button>

        <Stack gap="xl">
          {items.length === 0 && items.length === 0 && !loading && (
            <Text ta="center" size="sm" c="dimmed">
              No hay categorías ni artículos registrados.
            </Text>
          )}

          {items.map((category) => (
            <Box key={category.id}>
              <Box mb="xs" pb="xs" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <Title order={4} c="white" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {category.name}
                </Title>
                {category.description && (
                  <Text fz="xs" c="dimmed">{category.description}</Text>
                )}

                {category.items.length > 0 ? (
                  <Stack gap="md" mb="md">
                    {category.items.map((item) => (
                      <ItemCard key={item.id} category={category.id} item={item} changeOrder={changeOrder} handleOpenDelete={handleOpenDelete} menu_slug={menu_slug} business_slug={business_slug} />
                    ))}
                  </Stack>
                ) : (
                  <Text fz="xs" c="dimmed" fs="italic" ml="xs">
                    Sin productos en esta categoría
                  </Text>
                )}
              </Box>


              {category.subcategories.length > 0 && (
                <Stack gap="md" ml="xs" pl="sm" style={{ borderLeft: '2px solid rgba(0, 200, 200, 0.3)' }}>
                  {category.subcategories.map((subcategory) => (
                    <Box key={subcategory.id}>
                      {/* Titular Subcategoría */}
                      <Box mb="xs">
                        <Text fw={600} fz="sm" c="teal.3">
                          ↳ {subcategory.name}
                        </Text>
                        {subcategory.description && (
                          <Text fz="xs" c="dimmed">{subcategory.description}</Text>
                        )}
                      </Box>

                      {/* Ítems de la Subcategoría */}
                      {subcategory.items.length > 0 ? (
                        <Stack gap="sm">
                          {subcategory.items.map((item) => (
                            <ItemCard key={item.id} category={category.id} subcategory={subcategory.id} item={item} changeOrder={changeOrder} handleOpenDelete={handleOpenDelete} menu_slug={menu_slug} business_slug={business_slug} />
                          ))}
                        </Stack>
                      ) : (
                        <Text fz="xs" c="dimmed" fs="italic" ml="xs">
                          Sin productos en esta subcategoría
                        </Text>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

          ))}
        </Stack>
      </Container>

      <Modal opened={opened} onClose={close} title="Confirmar eliminación" centered>
        <Text size="sm">¿Estás seguro de que deseas eliminar este artículo?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={close}>Cancelar</Button>
          <Button color="red" onClick={handleDelete}>Eliminar</Button>
        </Group>
      </Modal>
    </>
  );
}