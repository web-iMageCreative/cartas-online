const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class MenusServices {
  static async createMenu(menuData) {
    const response = await fetch(`${API_URL}/menus/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });

    const data = await response.json();
    return data;
  }

  static async listMenu(business_slug) {
    const response = await fetch( `${API_URL}/menus/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({business_slug: business_slug}),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error('Error al obtener los menús' + result.message);
    }

    return result.data;
  }
}