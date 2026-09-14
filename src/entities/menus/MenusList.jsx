import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Stack, Image, LoadingOverlay, Card, Group, Avatar, Button, UnstyledButton, Text, Box} from '@mantine/core';
import { IconEye, IconEdit, IconTrash,IconFilePlus } from '@tabler/icons-react';
import MenusServices from './MenusService';
import BusinessesServices from '../businesses/BusinessesService';
import { NotificationService } from '../../shared/NotificationService';

export default function MenusList({ businessSlug }) {
  const params = useParams();
  const business_slug = params?.business_slug || businessSlug;

  const [menus, setMenus] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!business_slug) return;
    
    setLoading(true);

    Promise.all([
      BusinessesServices.getBusinessNameBySlug(business_slug),
      MenusServices.listMenu(business_slug)
    ])
      .then(([nameData, menusData]) => {
        setBusinessName(nameData);
        setMenus(menusData);
      })
      .catch((error) => {
        NotificationService.error(error, {
          title: 'Error cargando datos de los menús',
        });
      })
      .finally(() => setLoading(false));
  }, [business_slug]);

  return (
    <Container maw="450"  miw="xll" pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0, blur: 2 }} />
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Menús de {businessName}
      </Title>
       <Button 
        bg='custom.5'
        mb="xl"
        variant="outline"
        fullWidth
        leftSection={<IconFilePlus size={18} />}ta="center" fz="xs" component="a" href={`/${business_slug}/menus/create`}>Crear nuevo menu</Button>
      

      <Stack gap="md">
        {menus.map((menu) => (
          <Card key={menu.id} shadow="sm" padding="lg" withBorder>
            <Box mb="md">
              <Text mb="xs" fw={500}>{menu.name}</Text>
              <Text size="sm" c="dimmed">
                {menu.description}
              </Text>
            </Box>

           <Card.Section bg="custom.5">
            <Group justify="space-around" mt="md" mb="md" ml="xl" mr="xl">
              <UnstyledButton ta="center" fz="xs" component="a" href={`/menu/${menu.slug}/`}><IconEye /><br/>Ver</UnstyledButton>
              <UnstyledButton ta="center" fz="xs" component="a" href={`/menu/${menu.slug}/update`}><IconEdit /><br/>Editar</UnstyledButton>
              <UnstyledButton ta="center" fz="xs" component="a" href={`/menu/${menu.slug}/delete`}><IconTrash /><br/>Eliminar</UnstyledButton>
            </Group>
          </Card.Section>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}