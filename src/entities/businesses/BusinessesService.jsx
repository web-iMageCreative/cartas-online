const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class BusinessesServices {
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
     //body: JSON.stringify(formData),
       body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al crear el Negocio');
    }

    return await response.json();

  }

   static async listBusinesses(userId) {
    const response = await fetch( `${API_URL}/businesses/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error('Error al obtener los negocios:' + result.message);
    }

    return result.data;
  }
}
