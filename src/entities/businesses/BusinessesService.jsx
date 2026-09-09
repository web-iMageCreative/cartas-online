const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class BusinessesServices {
  // Método 1: Crear negocio (usa FormData para enviar imágenes)
  static async createBusiness(menuData) {
    const formData = new FormData();

    Object.entries(menuData).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      formData.append(key, String(value));
    });

    console.log("FormData para crear negocio:", formData);
    console.log("menuData:", menuData);

    const response = await fetch(`${API_URL}/businesses/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al crear el Negocio');
    }

    return await response.json();
  }

  // Método 2: Obtener negocio por Slug (usa JSON para enviar solo texto)
  static async getBusinessBySlug(business_slug) {
    const response = await fetch(`${API_URL}/businesses/show`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ business_slug }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error al obtener el negocio');
    }

    return result.data;
  }
}