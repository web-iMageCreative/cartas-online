import ItemsForm from "./ItemsForm";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItemsServices from "./ItemsService";
import MenusServices from "../menus/MenusService";
import { NotificationService } from "../../shared/NotificationService";

export default function ItemsCreate() {
  const { menu_slug } = useParams();
  const { business_slug } = useParams();
  const [ menuId, setMenuId ] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuId = async () => {
      setLoading(true);

      await MenusServices.getMenuBySlug(menu_slug)
        .then((menuData) => {
          setMenuId(menuData.id);
        })
        .catch((error) => {
          console.error("Error al obtener la id del menú por slug: ", error);
        })
        .finally(() => setLoading(false));
    }

    fetchMenuId();
  },[]);

  const handleSubmit = async (values) => {
    if (!menuId) return;
    setLoading(true);

    const payload = {
      ...values,
      menu_id: menuId
    };

    console.log("Payload para crear menú:", payload);

    await ItemsServices.createItem(payload)
      .then((message) => {
        NotificationService.success(message, {title: 'Producto creado'});
        navigate(`/${business_slug}/${menu_slug}/productos`);
      })
      .catch((error) => {
        NotificationService.error(error, {title: 'Error creando producto'})
      })
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    navigate(`/${business_slug}/${menu_slug}/productos`);
  };

    return (
        <ItemsForm
          menuSlug={menu_slug}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          mode="create"
        />
      );
}