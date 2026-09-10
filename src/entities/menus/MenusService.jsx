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

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data;
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
    
    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }

  
  static async getMenuById( menu_id ) {
    if (!menu_id) return null;

    const response = await fetch(`${API_URL}/menus/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: menu_id })
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data[0];
  }
}