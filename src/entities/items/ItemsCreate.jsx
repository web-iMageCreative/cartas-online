import ItemsForm from "./ItemsForm";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ItemsServices from "./ItemsService";
import MenusServices from "../menus/MenusService";

export default function ItemsCreate() {

  const { menu_slug } = useParams();
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
    navigate(`/${menu_slug}/menus`);
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