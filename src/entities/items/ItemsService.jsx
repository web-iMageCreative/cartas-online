const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class ItemsService {

  static async getItemsByMenu(menuId) {
    const response = await fetch(`${API_URL}/items/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ menu_id: menuId })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }
  static async getPublicMenuItemsByMenu(menuId) {
    const response = await fetch(`${API_URL}/public-menu/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: menuId })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }

  static async getItemById(id) {
    const response = await fetch(`${API_URL}/items/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }

  static async createItem(data) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      // Si los alérgenos vienen como array de IDs, los serializamos a JSON
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      formData.append(key, String(value));
    });

    const response = await fetch(`${API_URL}/items/create`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.message;
  }

  static async updateItem(data) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      formData.append(key, String(value));
    });

    const response = await fetch(`${API_URL}/items/update`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.message;
  }

  static async deleteItem(id) {
    const response = await fetch(`${API_URL}/items/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.message;
  }

  static async getAllergens() {
    const response = await fetch(`${API_URL}/allergens/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }


  static async getCategories(menuSlug) {
    if (!menuSlug) return [];

    const response = await fetch(`${API_URL}/items/get-categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ menu_slug: menuSlug })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener categorías');
    }

    return result.data;
  }
}