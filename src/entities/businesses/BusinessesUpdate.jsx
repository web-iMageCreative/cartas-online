import BusinessesForm from "./BusinessesForm";
import { useNavigate, useParams } from "react-router-dom";
import BusinessesService from "./BusinessesService";
import { NotificationService } from '../../shared/NotificationService';
import { useEffect, useState } from "react";
import BusinessesServices from "./BusinessesService";

export default function BusinessesUpdate() {
  const { business_slug } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);

      await BusinessesServices.getBusinessBySlug(business_slug)
        .then((data) => {
          data.deleteLogo = false;
          data.deleteCover = false;
          setInitialValues(data);
        })
        .catch ((error) => NotificationService.error(error, {title: "Error al cargar negocio"}))
        .finally (() => setLoading(false))
    }

    fetchBusiness();
  }, [])

  const handleSubmit = async (values) => {
    setLoading(true);
    
    await BusinessesService.updateBusiness(values)
      .then((message) => {
        NotificationService.success(message, {title: "Negocio editado"})
        navigate("/dashboard");
      })
      .catch((error) => NotificationService.error(error, {title: "Error al editar negocio"}))
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    NotificationService.info( 
      'Ha cancelado la creación de un nuevo negocio', 
      {title: 'Operación cancelada'}
    );
    navigate("/dashboard"); 
  }

  return (
    <>
    {initialValues &&
      <BusinessesForm 
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
        mode="update"
      />
    }
    </>
  );
}