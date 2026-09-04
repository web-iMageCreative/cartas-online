import { Paper, Title } from '@mantine/core';
import MenusForm from './MenusForm';
import { useParams, useNavigate } from 'react-router-dom';
import MenusServices from './MenusService';


export default function MenusCreate() {
  const { business_slug } = useParams();
  const navigate = useNavigate();
  console.log('business_slug:', business_slug);

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values);
    // Aquí puedes agregar la lógica para enviar los datos del formulario al backend
    values.business_slug = business_slug;

    MenusServices.createMenu(values)
      .then((response) => {
        console.log('Menu created successfully:', response);
        // Aquí puedes agregar la lógica para manejar la respuesta del backend
        navigate(`/${business_slug}/menus`); // Redirige a la página de menús del negocio
      })
      .catch((error) => {
        console.error('Error creating menu:', error);
        // Aquí puedes agregar la lógica para manejar errores
      });
  }

  const handleCancel = () => {
    console.log('Form cancelled');
    // Aquí puedes agregar la lógica para manejar la cancelación del formulario
    navigate(`/${business_slug}/menus`); // Redirige a la página de menús del negocio
  }

  return (
    <Paper style={{ width: 420 }}>
      <Title order={2} ta="center" mb="xs">
        🍽️ Cartas Online
      </Title>
      <Title order={3} c="dimmed" ta="center" mb="lg">
        Crear Menú para {business_slug}
      </Title>
    
      <MenusForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </Paper>
  );
}