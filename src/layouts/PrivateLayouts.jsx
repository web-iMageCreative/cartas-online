import {
  AppShell,
  Burger,
  Button,
  Group,
  Text,
  Center,
  Box
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { AuthService } from '../entities/users/AuthService';

export default function PrivateLayout() {
  const [opened, { toggle }] = useDisclosure();

  const handleLogout = async () => {
    await AuthService.logout();
  }

  return (
    <AppShell
      header={{ height: 60 }}
      // navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
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
            <Box>
              <Text fw={800} size="xl" c="custom.1">
                Kamarero.es
              </Text>
              <Text fw={300} size="xs" c="custom.0">
                Cartas Online para bares y restaurante
              </Text>
            </Box>
          </Group>

          <Button variant="default" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Group>
      </AppShell.Header>

      {/* <AppShell.Navbar p="md">
        <Stack gap="sm">
          <Button variant="subtle" justify="flex-start" onClick={() => navigate('/inicio')}>
            Dashboard
          </Button>
          <Button variant="subtle" justify="flex-start" onClick={() => navigate('/negocios/')}>
            Negocios
          </Button>
        </Stack>
      </AppShell.Navbar> */}

      <AppShell.Main fz="sm">
        <Center display={'flex'}>
          <Outlet />
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}