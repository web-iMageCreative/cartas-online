const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class BusinessesServices {
  static async getBusinessNameBySlug(slug) {
    if (!slug) return null;

    const response = await fetch(`${API_URL}/businesses/get-name-by-slug`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    });

    const result = await response.json();

    if (!result.success) {
      return null;
    }

    return result.data?.name || slug;
  }
  
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

  static async getBusinessBySlug( slug ) {
    if (!slug) return null;

    const response = await fetch(`${API_URL}/businesses/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    });

    const result = await response.json();

    if (!result.success) {
      return null;
    }

    return result.data?.name || slug;
  }
}