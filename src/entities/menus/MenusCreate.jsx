import { useState } from  'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenusForm from './MenusForm';
import MenusServices from './MenusService';
import { NotificationService } from '../../shared/NotificationService';


export default function MenusCreate() {
  const { business_slug } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log('Form submitted with values:', values);
    // Aquí puedes agregar la lógica para enviar los datos del formulario al backend
    values.business_slug = business_slug;

    try {
      setLoading(true);
      const result = await MenusServices.createMenu(values);

      if (result.success) {
        NotificationService.success('Ha añadido correctamente un nuevo menú', {
          title: 'Nuevo Menú creado',
        });

        navigate(`/${business_slug}/menus`);
      } else {
        NotificationService.error(result.message, {
          title: 'Error crando Menú',
        });
      }
    } catch(error) {
      NotificationService.error(error.message, {
        title: 'Error crando Menú',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    NotificationService.info('Ha cancelado la creación de un nuevo menú', {
      title: 'Operación cancelada'
    });
    
    navigate(`/${business_slug}/menus`); // Redirige a la página de menús del negocio
  }

  return (
    <MenusForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={loading} />
  );
}