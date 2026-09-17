import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Title, 
  Stack, 
  LoadingOverlay, 
  Group, 
  Text, 
  Box, 
  Paper,
  Badge,
  Avatar
} from '@mantine/core';
import CategoriesService from '../categories/CategoriesService';
import ItemsService from './ItemsService';
import MenuService from '../menus/MenusService';
import { NotificationService } from '../../shared/NotificationService';

export default function ItemsReadList() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const { menu_slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const menuData = await MenuService.getMenuBySlug(menu_slug);
        setMenu(menuData);

        if (menuData?.id) {
          const [categoriesData, itemsData] = await Promise.all([
            CategoriesService.getCategoriesByMenuId(menuData.id),
            ItemsService.getItemsByMenu(menuData.id)
          ]);

          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
          setItems(Array.isArray(itemsData) ? itemsData : []);
        }
      } catch (error) {
        console.error(error);
        NotificationService.error(
          error.message || error, 
          { title: 'Error al cargar la carta' }
        );
      } finally {
        setLoading(false);
      }
    };

    if (menu_slug) {
      fetchData();
    }
  }, [menu_slug]);

  const rootCategories = categories.filter(
    (cat) => !cat.parent_id || Number(cat.parent_id) === 0
  );

  const getSubcategories = (category) => {
    if (Array.isArray(category.subcategories) && category.subcategories.length > 0) {
      return category.subcategories;
    }
    return categories.filter((cat) => String(cat.parent_id) === String(category.id));
  };

  const getDirectCategoryItems = (catId) => {
    return items.filter(
      (item) =>
        String(item.category_id) === String(catId) &&
        (!item.subcategory_id || String(item.subcategory_id) === '0' || String(item.subcategory_id) === 'null')
    );
  };

  const getSubcategoryItems = (subcatId) => {
    return items.filter(
      (item) =>
        String(item.category_id) === String(subcatId) ||
        String(item.subcategory_id) === String(subcatId)
    );
  };

  return (
    <Container maw={480} miw={300} pos="relative" py="md">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0, blur: 2 }} />

      <Title order={3} c="white" ta="center" mb="lg">
        {menu?.name || 'Carta'}
      </Title>

      <Stack gap="xl">
        {rootCategories.length === 0 && items.length === 0 && !loading && (
          <Text ta="center" size="sm" c="dimmed">
            No hay categorías ni artículos disponibles.
          </Text>
        )}

        {rootCategories.map((category) => {
          const directItems = getDirectCategoryItems(category.id);
          const subcategories = getSubcategories(category);

          return (
            <Box key={category.id}>
              {/* Encabezado Categoría Principal */}
              <Box mb="xs" pb="xs" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <Title order={4} c="white" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {category.name}
                </Title>
                {category.description && (
                  <Text fz="xs" c="dimmed">{category.description}</Text>
                )}
              </Box>

              {/* Ítems directos */}
              {directItems.length > 0 && (
                <Stack gap="xs" mb="md">
                  {directItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </Stack>
              )}

              {/* Subcategorías y sus ítems */}
              {subcategories.length > 0 && (
                <Stack gap="md" ml="xs" pl="sm" style={{ borderLeft: '2px solid rgba(0, 200, 200, 0.3)' }}>
                  {subcategories.map((subcategory) => {
                    const subcatItems = getSubcategoryItems(subcategory.id);

                    return (
                      <Box key={subcategory.id}>
                        <Box mb="xs">
                          <Text fw={600} fz="sm" c="teal.3">
                            ↳ {subcategory.name}
                          </Text>
                          {subcategory.description && (
                            <Text fz="xs" c="dimmed">{subcategory.description}</Text>
                          )}
                        </Box>

                        {subcatItems.length > 0 ? (
                          <Stack gap="xs">
                            {subcatItems.map((item) => (
                              <ItemCard key={item.id} item={item} />
                            ))}
                          </Stack>
                        ) : (
                          <Text fz="xs" c="dimmed" fs="italic" ml="xs">
                            Sin artículos disponibles
                          </Text>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          );
        })}
      </Stack>
    </Container>
  );
}

// Componente de tarjeta exclusivo para lectura
function ItemCard({ item }) {
  return (
    <Paper 
      p="xs" 
      radius="md" 
      style={{ 
        backgroundColor: 'rgba(10, 25, 35, 0.6)', 
        border: '1px solid rgba(255, 255, 255, 0.08)' 
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          {item.image && (
            <Avatar src={item.image} alt={item.name} radius="sm" size="md" />
          )}

          <Box style={{ overflow: 'hidden' }}>
            <Group gap="xs" align="center">
              <Text fw={600} size="sm" c="white" truncate>{item.name}</Text>
              <Badge color="teal" variant="light" size="xs">{item.price} €</Badge>
            </Group>
            {item.description && (
              <Text fz="xs" c="dimmed" truncate>{item.description}</Text>
            )}
          </Box>
        </Group>
      </Group>
    </Paper>
  );
}