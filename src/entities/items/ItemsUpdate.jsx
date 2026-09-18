import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ItemsForm from "./ItemsForm";
import ItemsService from "./ItemsService";
import { NotificationService } from "../../shared/NotificationService";

export default function ItemsUpdate() {
  const { item_id } = useParams();
  const { menu_slug } = useParams();
  const { business_slug } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);

      await ItemsService.getItemById(item_id)
        .then((data) => {
          data.allergens.map((d) => String(d));
          data.allergens = data.allergens.map((d) => String(d));
          data.deleteImage = false;
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
        navigate(`/${business_slug}/${menu_slug}/productos`);
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
    navigate(`/${business_slug}/${menu_slug}/productos`);
  };

  return (
    <>
      {initialValues && (
        <ItemsForm
          menuSlug={menu_slug}
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