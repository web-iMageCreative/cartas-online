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
    setLoading(true);
    values.business_slug = business_slug;

    await MenusServices.createMenu(values)
      .then(() => {
        NotificationService.success(
          'Ha añadido correctamente un nuevo menú', 
          {title: 'Nuevo Menú creado'}
        );
      })
      .catch((error) => {
        NotificationService.error(error.message, {
          title: 'Error creando Menú: ',
        });
      })
      .finally(() => setLoading(false));
  }

  const handleCancel = () => {
    NotificationService.info(
      'Ha cancelado la creación de un nuevo menú', 
      {title: 'Operación cancelada'}
    );
    
    navigate(`/${business_slug}/menus`);
  }

  return (
    <MenusForm 
      onSubmit={handleSubmit} 
      onCancel={handleCancel} 
      isLoading={loading} 
    />
  );
}