import ItemsForm from "./ItemsForm";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItemsServices from "./ItemsService";
import { AuthService } from "../users/AuthService";

export default function ItemsCreate() {

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
      const response = await ItemsServices.createItem(payload);
      console.log("Ítem creado:", response);
      navigate(`/${business_slug}/items`);
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
        <ItemsForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          mode="create"
        />
      );
}