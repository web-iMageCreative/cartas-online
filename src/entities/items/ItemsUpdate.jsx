import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ItemsForm from "./ItemsForm";
import ItemsService from "./ItemsService";
import { NotificationService } from "../../shared/NotificationService";

export default function ItemsUpdate() {
  const { item_id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);

      await ItemsService.getItemById(item_id)
        .then((data) => {
          setInitialValues(data);
        })
        .catch((error) =>
          NotificationService.error(
            error.message || error,
            { title: "Error al cargar artículo" }
          )
        )
        .finally(() => setLoading(false));
    };

    if (item_id) {
      fetchItem();
    }
  }, [item_id]);

  const handleSubmit = async (values) => {
    setLoading(true);

    await ItemsService.updateItem(values)
      .then((message) => {
        NotificationService.success(message, { title: "Artículo editado" });
        navigate("/dashboard");
      })
      .catch((error) =>
        NotificationService.error(
          error.message || error,
          { title: "Error al editar artículo" }
        )
      )
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    NotificationService.info(
      "Ha cancelado la edición del artículo",
      { title: "Operación cancelada" }
    );
    navigate("/dashboard");
  };

  return (
    <>
      {initialValues && (
        <ItemsForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          submitLabel="Actualizar Artículo"
          mode="update"
        />
      )}
    </>
  );
}