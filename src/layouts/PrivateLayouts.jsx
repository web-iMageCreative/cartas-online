import {
  AppShell,
  Burger,
  Button,
  Group,
  Stack,
  Text,
  Center
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthService } from '../entities/users/AuthService';

export default function PrivateLayout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await AuthService.logout();
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700} size="lg" c="custom.0">
              Cartas Online
            </Text>
          </Group>

          <Button variant="default" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="sm">
          <Button variant="subtle" justify="flex-start" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button variant="subtle" justify="flex-start" onClick={() => navigate('/businesses/create')}>
            Negocios
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main fz="sm">
        <Center display={'flex'}>
          <Outlet />
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}