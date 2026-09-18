import CategoriesForm from "./CategoriesForm";
import { useNavigate, useParams } from "react-router-dom";
import CategoriesService from "./CategoriesService";
import { NotificationService } from "../../shared/NotificationService";
import MenuService from "../menus/MenusService";
import { useState, useEffect } from "react";

export default function CategoriesCreate() {
  const navigate = useNavigate();
  const { menu_slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(null); 
  
  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      
      await MenuService.getMenuBySlug(menu_slug)
        .then(async (menu) => setMenu(menu))
        .catch((error) => NotificationService.error(error, {title: "Error al obtener el menú"}))
        .finally(() => setLoading(false));
    };

    fetchMenuData();
  }, []);

  const handleSubmit = async (values) => {
      setLoading(true);
        values.menu_id = menu.id;
      console.log("Payload para crear categoría:", values);

      // Crear categoría
      await CategoriesService.createCategories(values)
      .then((response) => {
        NotificationService.success(response, {title: "Categoría creada"});
        navigate(`/${business_slug}/${menu_slug}/categorias`);
      })
      .catch((error) => {
        NotificationService.error(error, {title: "Error"});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    NotificationService.info("Operación cancelada por el usuario", {title: "Operación cancelada"});
    navigate(`/${business_slug}/${menu_slug}/categorias`);
  };

  return (
    <>
    {menu && (
      <CategoriesForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
        menuId={menu.id}
      />
    )}
    </>
  );
}