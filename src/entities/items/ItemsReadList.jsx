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
  Avatar,
  Tooltip
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
            ItemsService.getPublicMenuItemsByMenu(menuData.id)
          ]); console.log(itemsData);

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
    <Container maw={500} miw={300} pos="relative" py="xl">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0.1, blur: 3 }} />

      {/* Título Principal Restaurante */}
      {menu?.name && (
        <Box mb="xl" ta="center">
          <Title order={2} c="white" fw={700} style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            {menu.name}
          </Title>
          <Text fz="xs" c="dimmed" mt={4} style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>
            Nuestra Carta
          </Text>
        </Box>
      )}

      <Stack gap="2rem">
        {rootCategories.length === 0 && items.length === 0 && !loading && (
          <Text ta="center" size="sm" c="dimmed">
            No hay platos disponibles en esta carta actualmente.
          </Text>
        )}

        {rootCategories.map((category) => {
          const directItems = getDirectCategoryItems(category.id);
          const subcategories = getSubcategories(category);

          return (
            <Box key={category.id}>
              {/* Categoría Principal Estilizada */}
              <Box mb="md" pb="xs" style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.2)' }}>
                <Title order={3} c="teal.3" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {category.name}
                </Title>
                {category.description && (
                  <Text fz="xs" c="dimmed" mt={2}>{category.description}</Text>
                )}
              </Box>

              {/* Ítems directos */}
              {directItems.length > 0 && (
                <Stack gap="sm" mb="lg">
                  {directItems.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </Stack>
              )}

              {/* Subcategorías */}
              {subcategories.length > 0 && (
                <Stack gap="lg" ml="xs" pl="md" style={{ borderLeft: '2px solid rgba(0, 200, 200, 0.25)' }}>
                  {subcategories.map((subcategory) => {
                    const subcatItems = getSubcategoryItems(subcategory.id);

                    return (
                      <Box key={subcategory.id}>
                        <Box mb="xs">
                          <Text fw={600} fz="sm" c="cyan.2" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {subcategory.name}
                          </Text>
                          {subcategory.description && (
                            <Text fz="xs" c="dimmed">{subcategory.description}</Text>
                          )}
                        </Box>

                        {subcatItems.length > 0 ? (
                          <Stack gap="sm">
                            {subcatItems.map((item) => (
                              <MenuCard key={item.id} item={item} />
                            ))}
                          </Stack>
                        ) : (
                          <Text fz="xs" c="dimmed" fs="italic">
                            Sin opciones en esta sección
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

// Tarjeta de Ítem con formato tipo carta digital
function MenuCard({ item }) {
  return (
    <Paper 
      radius="lg" 
      p="sm" 
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.75)', 
        border: '1px solid rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
        {/* Foto de la receta/plato si existe */}
        {item.image && (
          <Avatar 
            src={item.image} 
            alt={item.name} 
            radius="md" 
            size={64} 
            style={{ flexShrink: 0 }}
          />
        )}

        {/* Info principal: Nombre, Descripción e Iconos de Alérgenos */}
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <Group justify="space-between" align="baseline" wrap="nowrap" gap="xs">
            <Text fw={600} size="sm" c="white" truncate>
              {item.name}
            </Text>
            {/* Precio destacado */}
            <Badge 
              variant="filled" 
              color="teal" 
              size="md" 
              radius="sm"
              style={{ fontWeight: 700 }}
            >
              {item.price} €
            </Badge>
          </Group>

          {item.description && (
            <Text fz="xs" c="dimmed" lh="1.3" mt={4} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.description}
            </Text>
          )}

          {/* Listado de iconos de Alérgenos si vienen incluidos en el objeto item */}
          {Array.isArray(item.allergens) && item.allergens.length > 0 && (
            <Group gap={6} mt="xs">
              {item.allergens.map((allergen) => (
                <Tooltip key={allergen.id} label={allergen.name} withArrow position="bottom">
                  <img src={allergen.icon} alt={allergen.name} width="16" height="16" style={{ opacity: 0.8 }} />
                </Tooltip>
              ))}
            </Group>
          )}
        </Box>
      </Group>
    </Paper>
  );
}