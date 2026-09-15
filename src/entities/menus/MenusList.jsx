import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import { Container, Title, Stack, LoadingOverlay, Card, Group, Button, UnstyledButton, Text, Box, Modal} from '@mantine/core';
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
  const [menuToDelete, setMenuToDelete] = useState(null); //cambio
  const [opened, { open, close }] = useDisclosure(false);
  const handleDeleteMenu = (menuId) => {
  setMenuToDelete(menuId);
  open();
  }; //cambio
  useEffect(() => {
    if (!business_slug) return;

    const fetchMenus = async () => {
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
    }
    
    fetchMenus();
    
  }, [business_slug]);

   const confirmDeleteMenu = async () => { //cambio
     try {
    setLoading(true);

    await MenusServices.deleteMenu(menuToDelete);

    NotificationService.success('Menú eliminado correctamente');

    // Eliminarlo de la lista que tienes en React
    setMenus((currentMenus) =>
      currentMenus.filter((menu) => menu.id !== menuToDelete)
    );

    close();
    setMenuToDelete(null);

  } catch (error) {
    NotificationService.error(error.message, {
    title: 'Error eliminando el menú',
  });
  } finally {
    setLoading(false);
  }
}; //cambio
  

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
              <UnstyledButton ta="center" fz="xs" component="a" href={`/${business_slug}/menus/${menu.slug}/`}><IconEye /><br/>Ver</UnstyledButton>
              <UnstyledButton ta="center" fz="xs" component="a" href={`/${business_slug}/menus/${menu.slug}/update`}><IconEdit /><br/>Editar</UnstyledButton>
              <UnstyledButton ta="center" fz="xs" component="a" onClick={() => handleDeleteMenu(menu.id)}><IconTrash /><br/>Eliminar</UnstyledButton>
            </Group>
          </Card.Section>
          </Card>
        ))}
      </Stack>

      <Modal opened={opened} onClose={close} title="Confirmar eliminación" centered>
        <Text size="sm">¿Estás seguro de que deseas eliminar este menú?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={close}>Cancelar</Button>
          <Button color="red" onClick={confirmDeleteMenu}>Eliminar</Button>
        </Group>
      </Modal>

    </Container>
  );
}