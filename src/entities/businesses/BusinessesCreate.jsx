import { Paper } from "@mantine/core";
import BusinessesForm from "./BusinessesForm";
import { hasLength } from "@mantine/form";
import { useNavigate } from "react-router-dom";

export default function BusinessesCreate() {
    const navigate = useNavigate();
    const handleSubmit = (values) => {
        // Aquí puedes manejar la lógica de creación del negocio, como enviar los datos a tu API
        console.log("Datos del negocio:", values);
    }

    const handleCancel = () => {
        navigate("/dashboard"); // Redirige a la página de dashboard o a la lista de negocios
        // Aquí puedes manejar la lógica de cancelación, por ejemplo, redirigir a la lista de negocios
    };

  return (
    <Paper>
      <h1>Create Business</h1>
      <p>This is the business creation page.</p>
      <BusinessesForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}      
      />
        
    </Paper>
  );
}