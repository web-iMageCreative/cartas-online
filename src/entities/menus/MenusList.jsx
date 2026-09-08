import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MenusServices from './MenusService';
import { Container, Title, Paper, Stack } from '@mantine/core';
import { NotificationService } from '../../shared/NotificationService';

export default function MenusList() {
  const { business_slug } = useParams();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    MenusServices.listMenu(business_slug)
      .then((data) => {
        setMenus(data);
      })
      .catch((error) => {
        NotificationService.error('No encontramos menús para este negocio: ' + error, {
          title: 'Error cargando menús',
        });
      });
  }, [business_slug]);

  return (
    <Container miw="450">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Menús de {business_slug}
      </Title>
      <Stack gap="md">
        {menus.map((menu) => (
          <Paper p="lg" key={menu.id}>
            <Title order={4} c="custom.0" mb="xs">
              {menu.name}
            </Title>
            <p>{menu.description}</p>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}







  