import MenusForm from "./MenusForm";
import { useNavigate, useParams } from "react-router-dom";
import MenusService from "./MenusService";
import { NotificationService } from '../../shared/NotificationService';
import { useEffect, useState } from "react";

export default function MenusUpdate() {
  const { menu_slug } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);

      await MenusService.getMenuBySlug(menu_slug)
        .then((data) => {
          setInitialValues(data);
        })
        .catch ((error) => NotificationService.error(error, {title: "Error al cargar menú"}))
        .finally (() => setLoading(false))
    }

    fetchMenu();
  }, [])

  const handleSubmit = async (values) => {
    setLoading(true);
    
    await MenusService.updateMenu(values)
      .then((message) => {
        NotificationService.success(message, {title: "Menú editado"})
        navigate("/dashboard");
      })
      .catch((error) => NotificationService.error(error, {title: "Error al editar menú"}))
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    NotificationService.info( 
      'Ha cancelado la creación de un nuevo menú', 
      {title: 'Operación cancelada'}
    );
    navigate("/dashboard"); 
  }

  return (
    <>
    {initialValues &&
      <MenusForm 
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
        submitLabel="Actualizar Menú"
        mode="update"
      />
    }
    </>
  );
}