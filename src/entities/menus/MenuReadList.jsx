import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Title, 
  Stack, 
  LoadingOverlay, 
  Group, 
  Text, 
  Box, 
  Paper,
  ActionIcon
} from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import MenusServices from './MenusService';
import BusinessesServices from '../businesses/BusinessesService';
import { NotificationService } from '../../shared/NotificationService';

export default function MenuReadList({ businessSlug }) {
  const [menus, setMenus] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const business_slug = params?.business_slug || businessSlug;

  useEffect(() => {
    if (!business_slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [nameData, menusData] = await Promise.all([
          BusinessesServices.getBusinessNameBySlug(business_slug),
          MenusServices.listMenu(business_slug)
        ]);

        setBusinessName(nameData);
        setMenus(Array.isArray(menusData) ? menusData : []);
      } catch (error) {
        console.error(error);
        NotificationService.error(
          error.message || error, 
          { title: 'Error al cargar los menús' }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [business_slug]);

  const handleSelectMenu = (menuSlug) => {
    navigate(`/${business_slug}/carta/${menuSlug}/`);;
  };

  return (
    <Container maw={500} miw={300} pos="relative" py="xl">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0.1, blur: 3 }} />

      {/* Encabezado del negocio */}
      {businessName && (
        <Box mb="xl" ta="center">
          <Title order={2} c="white" fw={700} style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
            {businessName}
          </Title>
          <Text fz="xs" c="dimmed" mt={4} style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>
            Nuestras Cartas
          </Text>
        </Box>
      )}

      {menus.length === 0 && !loading ? (
        <Text ta="center" size="sm" c="dimmed">
          No hay menús disponibles actualmente.
        </Text>
      ) : (
        <Stack gap="sm">
          {menus.map((menu) => (
            <MenuCard 
              key={menu.id} 
              menu={menu} 
              onClick={() => handleSelectMenu(menu.slug)} 
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}

function MenuCard({ menu, onClick }) {
  return (
    <Paper 
      withBorder
      bg="transparent"
      bd="1px solid teal.3"
      radius="md" 
      p="sm" 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <Text fw={700} size="md" c="teal.3" style={{ textTransform: 'uppercase' }}>
            {menu.name}
          </Text>

          {menu.description && (
            <Text fz="xs" c="dimmed" mt={2}>
              {menu.description}
            </Text>
          )}
        </Box>

        <ActionIcon 
          variant="subtle" 
          color="teal.3" 
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <IconEye size={20} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}