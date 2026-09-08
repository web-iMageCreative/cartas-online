// import {
//   AppShell,
//   Burger,
//   Button,
//   Group,
//   Stack,
//   Text,
// } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  // const [opened, { toggle }] = useDisclosure();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   // aquí tu lógica de logout
  //   navigate('/login');
  // };

  return (
    <Outlet />

    // <AppShell
    //   header={{ height: 60 }}
    //   navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
    //   padding="md"
    // >
    //   <AppShell.Header>
    //     <Group h="100%" px="md" justify="space-between">
    //       <Group>
    //         <Burger
    //           opened={opened}
    //           onClick={toggle}
    //           hiddenFrom="sm"
    //           size="sm"
    //         />
    //         <Text fw={700} size="lg">
    //           Cartas Online
    //         </Text>
    //       </Group>

    //       <Button variant="default" onClick={handleLogout}>
    //         Cerrar sesión
    //       </Button>
    //     </Group>
    //   </AppShell.Header>

    //   <AppShell.Navbar p="md">
    //     <Stack gap="sm">
    //       <Button variant="subtle" justify="flex-start" onClick={() => navigate('/dashboard')}>
    //         Dashboard
    //       </Button>
    //       <Button variant="subtle" justify="flex-start" onClick={() => navigate('/mis-cartas')}>
    //         Mis cartas
    //       </Button>
    //       <Button variant="subtle" justify="flex-start" onClick={() => navigate('/perfil')}>
    //         Perfil
    //       </Button>
    //     </Stack>
    //   </AppShell.Navbar>

    //   <AppShell.Main>
    //     <Outlet />
    //   </AppShell.Main>
    // </AppShell>
  );
}