import CategoriesForm from "./CategoriesForm";
import { useNavigate, useParams } from "react-router-dom";
import CategoriesService from "./CategoriesService";
import { NotificationService } from "../../shared/NotificationService";
import MenuService from "../menus/MenusService";
import { useState, useEffect } from "react";

export default function CategoriesCreate() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { menu_slug } = useParams();
  const [parentCategories, setParentCategories] = useState([]); //CAMBIO
  const [menu, setMenu] = useState(null); 
  
useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      
      await MenuService.getMenuBySlug(menu_slug)
      .then(async (menu) => {
        console.log("Menu obtenido:", menu);
        setMenu(menu);

        await CategoriesService.getCategoriesByMenuId(menu.id)
        .then((data) => setParentCategories(data))
        .catch((error) => NotificationService.error(error, {title: 'Error cargando categorias'}))
        .finally(() => setLoading(false));
      })
      .catch((error) => {
        NotificationService.error(error, {title: "Error al obtener el menú"});
        return;
      })
      .finally(() => setLoading(false));
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
      setLoading(true);
        values.menu_id = menu.id;
      console.log("Payload para crear categoría:", values);

      // Crear categoría
      await CategoriesService.createCategories(values)
      .then((response) => {
        NotificationService.success(response, {title: "Categoría creada"});
        navigate("/dashboard");
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
    navigate("/dashboard");
  };

  return (
    <CategoriesForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={loading}
      parentCategories={parentCategories}
    />
  );
}