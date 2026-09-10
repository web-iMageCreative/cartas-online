import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MenusServices from './MenusService';
import { Container, Title, Paper, Stack } from '@mantine/core';
import { NotificationService } from '../../shared/NotificationService';
import BusinessesServices from '../businesses/BusinessesService';

export default function MenusList({ businessSlug }) {
  const { business_slug } = useParams() || businessSlug; // Use the prop if provided, otherwise fallback to useParams
  const [menus, setMenus] = useState([]);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    BusinessesServices.getBusinessNameBySlug(business_slug)
      .then((data) => {
        setBusinessName(data)
      })
      .catch((error) => {
        NotificationService.error(error, {
          title: 'Error cargando Nombre del Negocio',
        });
      });

    MenusServices.listMenu(business_slug)
      .then((data) => {
        setMenus(data);
      })
      .catch((error) => {
        NotificationService.error(error, {
          title: 'Error cargando menús',
        });
      });
  }, [business_slug]);

  return (
    <Container miw="450">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Menús de {businessName}
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







  