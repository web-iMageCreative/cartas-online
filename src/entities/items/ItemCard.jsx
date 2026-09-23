import {
  Stack,
  Group,
  Text,
  Box,
  Paper,
  ActionIcon,
  Badge,
  Avatar,
  Tooltip
} from '@mantine/core';
import {
  IconTrash,
  IconEdit,
  IconArrowUp,
  IconArrowDown
} from '@tabler/icons-react';

export default function ItemCard({
  category,
  subcategory,
  item,
  changeOrder,
  handleOpenDelete,
  menu_slug,
  business_slug 
}) {

  const hasVariations = Array.isArray(item.variations) && item.variations.length > 0;

  return (
    <Paper className={subcategory ? "loop-element subitem" : "loop-element item"} radius="xl" pr="xs" style={{ overflow: 'hidden' }}>
      <Group justify="space-between" gap={15} align="center" wrap="nowrap">
        {/* Imagen / Avatar */}
        <Group gap="xs" wrap="nowrap">
          {item.image && (
            <Avatar src={item.image} alt={item.name} radius="0" size="xl" />
          )}
        </Group>

        {/* Información del Item */}
        <Group gap="xs" wrap="nowrap" justify="flex-start" style={{ flex: 1, overflow: 'hidden' }}>
          <Box py="sm" style={{ width: '100%', overflow: 'hidden' }}>
            <Group gap="xs" align="center" justify="flex-start">
              <Text fw={600} size="sm" c="white" truncate>{item.name}</Text>

              {/* Si NO tiene variaciones, muestra el precio estándar */}
              {!hasVariations && item.price !== undefined && item.price !== null && (
                <Badge color="teal" variant="light" size="xs">{item.price} €</Badge>
              )}
            </Group>

            {item.description && (
              <Text fz="xs" c="dimmed" truncate>
                {item.description}
              </Text>
            )}

            {/* CONDICIONAL: Si tiene variaciones, se renderizan aquí abajo */}
            {hasVariations && (
              <Group gap={4} mt={4} wrap="wrap">
                {item.variations.map((variant, index) => (
                  <Badge
                    key={variant.id || index}
                    color="teal.3"
                    variant="outline"
                    size="xs"
                    style={{ textTransform: 'none' }}
                  >
                    {variant.name}: {variant.price} €
                  </Badge>
                ))}
              </Group>
            )}

            {Array.isArray(item.allergens) && item.allergens.length > 0 && (
              <Group gap={6} mt="xs">
                {item.allergens.map((allergen) => (
                  <Tooltip key={allergen.id || allergen.name} label={allergen.name} withArrow position="bottom">
                    <img src={allergen.icon} alt={allergen.name} width="24" height="24" style={{ opacity: 0.8, filter: 'brightness(.7) saturate(.5) contrast(3)' }} />
                  </Tooltip>
                ))}
              </Group>
            )}
          </Box>
        </Group>

        {/* Acciones Editar y Eliminar */}
        <Group gap={6} wrap="nowrap" justify="flex-end">
          <ActionIcon
            variant="subtle"
            color="blue"
            component="a"
            href={`/${business_slug}/${menu_slug}/productos/editar/${item.id}`}
            title="Editar"
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleOpenDelete(item.id)}
            title="Eliminar"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>

        {/* Botones de orden vertical */}
        <Stack gap="xs" style={{ justifyContent: 'center' }}>
          <ActionIcon className="order-arrow up" size="sm" variant="light" onClick={() => changeOrder(1, item.id, category, subcategory)}>
            <IconArrowUp size="1rem" />
          </ActionIcon>
          <ActionIcon className="order-arrow down" size="sm" variant="light" onClick={() => changeOrder(-1, item.id, category, subcategory)}>
            <IconArrowDown size="1rem" />
          </ActionIcon>
        </Stack>
      </Group>
    </Paper>
  );
}