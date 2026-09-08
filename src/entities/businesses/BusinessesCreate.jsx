import BusinessesForm from "./BusinessesForm";
import { useNavigate } from "react-router-dom";
import BusinessesService from "./BusinessesService";
import { AuthService } from "../users/AuthService";
import { NotificationService } from '../../shared/NotificationService';
import { useState } from "react";

export default function BusinessesCreate() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      NotificationService.error( 'No hay usuario autenticado o no tiene id', {
        title: 'Error de identificación',
      });
      return;
    }

    const payload = {
      ...values,
      user_id: Number(currentUser.id),
    };

    try {
      setLoading(true);
      const response = await BusinessesService.createBusiness(payload);
      
      if (response.success) {
        NotificationService.success('El nuevo negocio ha sido añadido correctamente', {
          title: 'Negocio creado',
        });
      } else {
        NotificationService.error( response.message, {
          title: 'Error al añadir negocio',
        });
      }

      navigate("/dashboard");
    } catch (error) {
      NotificationService.error( error.message, {
        title: 'Error al añadir negocio',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    NotificationService.info( 'Ha cancelado la creación de un nuevo negocio', {
      title: 'Operación cancelada',
    });
    
    navigate("/dashboard"); 
  };

  return (
      <BusinessesForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
      />
  );
}