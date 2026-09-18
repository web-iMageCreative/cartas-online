import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Container, Title, Stack, Image, LoadingOverlay, Card, Group, Avatar, Button, UnstyledButton, Text, Box, Modal } from '@mantine/core';
import { IconTrash, IconEdit, IconEye, IconMail, IconPhone, IconMapPin, IconFilePlus } from '@tabler/icons-react';
import BusinessesService from './BusinessesService';
import { NotificationService } from '../../shared/NotificationService';
import { AuthService } from '../users/AuthService';

export default function BusinessesList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const userData = AuthService.getCurrentUser();
      
      await BusinessesService.listBusinesses(userData.id)
        .then((data) => setBusinesses(data))
        .catch((error) => NotificationService.error(error, { title: 'Error cargando negocios' }))
        .finally(() => setLoading(false));
    };

    fetchBusinesses();
  }, []);

  const handleOpen = (id) => {
    setSelectedId(id);
    open();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await BusinessesService.deleteBusiness(selectedId);
      setBusinesses((prev) => prev.filter((b) => b.id !== selectedId));
      close();
    } catch (error) {
      NotificationService.error(error, { title: 'Error eliminando negocio' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maw="450" pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ backgroundOpacity: 0, blur: 2 }} />
       
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Mis negocios
      </Title>
      
      <Button 
        bg="custom.5"
        mb="xl"
        variant="outline"
        fullWidth
        leftSection={<IconFilePlus size={18} />} 
        ta="center" 
        fz="xs" 
        component="a" 
        href="/negocios/crear"
      >
        Crear nuevo negocio
      </Button>
      
      <Stack gap="md">
        {businesses.map((business) => (
          <Card key={business.id} shadow="sm" padding="lg" withBorder>
            <Card.Section pos="relative">
              <Group justify='center' align='center'>
                <Image
                  src={business.cover_image || '/src/assets/imgs/business-dummy.jpg'}
                  height={160}
                  alt={business.name || 'Portada'}
                />
                { ! business.cover_image && ( <Text style={{textTransform: 'uppercase', letterSpacing:'5px'}} c="custom.1" pos="absolute">{business.name}</Text> )}
              </Group>
            </Card.Section>

            <Group justify="end" mt={-40} mb={-40}>
              {business.logo ? (<Avatar size="xl" src={business.logo} />) : (<Avatar color="custom.2" size="xl" styles={{ placeholder: { fontSize: '1rem' } }} name={business.name} />)}
            </Group>

            <Box mt="lg" mb="lg">
              <Text mb="sm" fw={500}>{business.name}</Text>
              <Text mb="lg" size="sm" c="dimmed">
                {business.description}
              </Text>
              <Group align="start" justify="space-between" wrap="no-wrap">
                <Text ta="center" fz="xs" fw={400}><IconMail /><br />{business.email}</Text>
                <Text ta="center" fz="xs" fw={400}><IconPhone /><br />{business.phone}</Text>
                <Text ta="center" fz="xs" fw={400}><IconMapPin /><br />{business.address}</Text>
              </Group>
            </Box>
            
            <Card.Section bg="custom.5">
              <Group justify="space-around" mt="md" mb="md" ml="xl" mr="xl">
                <UnstyledButton ta="center" fz="xs" component="a" href={'/' + business.slug + '/'}><IconEye /><br/>Ver</UnstyledButton>
                <UnstyledButton ta="center" fz="xs" component="a" href={'/' + business.slug + '/editar'}><IconEdit /><br/>Editar</UnstyledButton>
                <UnstyledButton ta="center" fz="xs" onClick={() => handleOpen(business.id)}><IconTrash /><br/>Eliminar</UnstyledButton>
              </Group>
            </Card.Section>          
          </Card>
        ))}
      </Stack>

      <Modal opened={opened} onClose={close} title="Confirmar eliminación" centered>
        <Text size="sm">¿Estás seguro de que deseas eliminar este negocio?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={close}>Cancelar</Button>
          <Button color="red" onClick={handleDelete}>Eliminar</Button>
        </Group>
      </Modal>
    </Container>
  );
}