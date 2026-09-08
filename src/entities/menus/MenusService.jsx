const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class MenusServices {
  static async createMenu(menuData) {
    try {
      const response = await fetch(`${API_URL}/menus/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuData),
      });
      if (!response.ok) {
        throw new Error('Error al crear el menú');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  }

  static async listMenu(business_slug) {
    try {
      const response = await fetch(
        `${API_URL}/menus/list`,
        {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({business_slug: business_slug}),
      }
      );

      console.log(response);

      const data = await response.json();

      if (!data.success) {
        throw new Error('Error al obtener los menús' + response.m);
      }

      console.log('MENÚS RECIBIDOS:', data);

      return data.data;
    } catch (error) {
      console.error('Error obteniendo los menús:', error);
      throw error;
    }
  }
}