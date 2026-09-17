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
    const fetchCategory = async () => {
      setLoading(true);

      await CategoriesService.getCategoryById(category_id)
        .then((data) => setInitialValues(data))
        .catch((error) => {
          NotificationService.error(
            error.message,
            { title: "Error cargando categoria" }
          )
        })
        .finally(() => setLoading(false));
    }

    fetchCategory();
  }, [category_id]);

  useEffect(() => {
    const fetchParents = async () => {
      setLoading(true);

      await CategoriesService.getCategoriesByMenuId(initialValues.menu_id)
        .then((data) => {
          const categoriesList = Array.isArray(data) ? data : [data];
          const parents = categoriesList.filter(
            (cat) => String(cat.id) !== String(category_id)
          );

          setParentCategories(parents);
        })
        .catch((error) => {
          NotificationService.error(
            error.message,
            { title: "Error cargando categorias Padre" }
          )
        })
        .finally(() => setLoading(false))
    }

    if (initialValues) {
      fetchParents();
    }
  }, [initialValues]);

  const handleSubmit = async (values) => {
    setLoading(true);

    await CategoriesService.updateCategory(values)
      .then((data) => {
        NotificationService.success(data, { title: "Categoría editada" });
        navigate("/dashboard");
      })
      .catch ((error) => {
        NotificationService.error(
          error.message || "Error al editar categoría",
          { title: "Error al editar" }
        );
      })
      .finally (() => setLoading(false));
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
      {initialValues && parentCategories && (
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