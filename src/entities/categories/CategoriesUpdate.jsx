import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoriesForm from "./CategoriesForm";
import CategoriesService from "./CategoriesService";
import { NotificationService } from "../../shared/NotificationService";

export default function CategoriesUpdate() {
  const { category_id } = useParams();

  const [initialValues, setInitialValues] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryAndParents = async () => {
      setLoading(true);

      try {
        // 1. Obtener la categoría actual por su ID
        const category = await CategoriesService.getCategoryById(category_id);
        setInitialValues(category);

        // 2. Cargar las categorías hermanas/padres del mismo menú
        if (category && category.menu_id) {
          const categoriesData = await CategoriesService.getCategoriesByMenuId(category.menu_id);
          const categoriesList = Array.isArray(categoriesData) ? categoriesData : [categoriesData];

          const parents = categoriesList.filter(
            (cat) => String(cat.id) !== String(category_id)
          );
          setParentCategories(parents);
        }

      } catch (error) {
        // Se pasa error.message como string para evitar el crash de React
        NotificationService.error(
          error.message || "Error al cargar la categoría",
          { title: "Error" }
        );
      } finally {
        setLoading(false);
      }
    };

    if (category_id) {
      fetchCategoryAndParents();
    }
  }, [category_id]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const message = await CategoriesService.updateCategory(values);
      NotificationService.success(message, { title: "Categoría editada" });
      navigate("/dashboard");
    } catch (error) {
      NotificationService.error(
        error.message || "Error al editar categoría",
        { title: "Error al editar" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    NotificationService.info(
      "Ha cancelado la edición de la categoría",
      { title: "Operación cancelada" }
    );
    navigate("/dashboard");
  };

  return (
    <>
      {initialValues && (
        <CategoriesForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          mode="update"
          parentCategories={parentCategories}
        />
      )}
    </>
  );
}