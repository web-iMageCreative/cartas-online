const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class BusinessesServices {
  static async createBusiness(menuData) {
    try {
      const response = await fetch(`${API_URL}/businesses/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el Negocio');
      }

      return await response.json();

    } catch (error) {
      console.error('Error al crear el negocio: ', error);
      throw error;
    }
  }
}