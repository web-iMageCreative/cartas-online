import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenusForm from "./MenusForm";
import MenusServices from "./MenusService";
import { AuthService } from "../users/AuthService";
import { NotificationService } from "../../shared/NotificationService";

export default function MenusCreate() {
  const { business_slug } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);

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

    await MenusServices.createMenu(payload)
      .then((data) => {
        NotificationService.success(data, {title: "Menú creado:"});
        navigate(`/${business_slug}/`);
      })
      .catch((error) => NotificationService.error(error, {title: "Error al crear menú"}))
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    navigate(`/${business_slug}/`);
  };

  return (
    <MenusForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={loading}
    />
  );
}