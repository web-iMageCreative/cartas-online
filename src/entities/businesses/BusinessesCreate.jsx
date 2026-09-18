import BusinessesForm from "./BusinessesForm";
import { useNavigate } from "react-router-dom";
import BusinessesService from "./BusinessesService";
import { NotificationService } from '../../shared/NotificationService';
import { AuthService } from "../users/AuthService";
import { useState } from "react";

export default function BusinessesCreate() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      NotificationService.error(
        "No hay usuario autenticado o no trae id", 
        {title: "Error creando negocio"}
      );
      
      return;
    }

    values.user_id = Number(currentUser.id);

    await BusinessesService.createBusiness(values)
      .then((message) => {
        NotificationService.success(message, {title: "Negocio creado"})
        navigate("/negocios");
      })
      .catch((error) => NotificationService.error(error, {title: "Error creando negocio"}))
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    NotificationService.info('Ha salido sin guardar los cambios', {title: "Opereción cancelada"})
    navigate("/negocios");
  };

  return (
    <BusinessesForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={loading}
    />
  );
}