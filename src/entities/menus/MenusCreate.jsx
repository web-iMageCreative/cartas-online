import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenusForm from "./MenusForm";
import MenusServices from "./MenusService";
import { AuthService } from "../users/AuthService";

export default function MenusCreate() {
  const { business_slug } = useParams();
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
      business_slug,
      user_id: Number(currentUser.id),
    };

    console.log("Payload para crear menú:", payload);

    try {
      setLoading(true);
      const response = await MenusServices.createMenu(payload);
      console.log("Menú creado:", response);
      navigate(`/${business_slug}/menus`);
    } catch (error) {
      console.error("Error creando menú: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/${business_slug}/menus`);
  };

  return (
    <MenusForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={loading}
    />
  );
}