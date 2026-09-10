import BusinessesForm from "./BusinessesForm";
import { useNavigate } from "react-router-dom";
import BusinessesService from "./BusinessesService";
import { AuthService } from "../users/AuthService";
import { useState } from "react";

export default function BusinessesCreate() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      console.error("No hay usuario autenticado o no trae id");
      return;
    }

    const payload = {
      ...values,
      user_id: Number(currentUser.id),
    };

    console.log("Payload para crear negocio:", payload);

    try {
      setLoading(true);
      const response = await BusinessesService.createBusiness(payload);
      console.log("Negocio creado:", response);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creando negocio: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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