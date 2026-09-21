const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class CategoriesService {
  static async getCategoryById(id) {
    const response = await fetch(`${API_URL}/categories/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener la categoría');
    }

    return result.data;
  }

  static async getCategoriesByMenuId(menu_id) {
    const response = await fetch(`${API_URL}/categories/get-by-menu-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: menu_id }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener las categorías del menú');
    }

    return result.data;
  }

  static async createCategories(categoryData) {
    const response = await fetch(`${API_URL}/categories/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al crear la categoría');
    }

    return result.message;
  }

  static async syncCategoriesOrder(id, displayOrder) {
    const response = await fetch(`${API_URL}/categories/sync-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: id, display_order: displayOrder}),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al actualizar la categoría');
    }

    return result.message;
  }

  static async updateCategory(categoryData) {
    const response = await fetch(`${API_URL}/categories/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al actualizar la categoría');
    }

    return result.message;
  }

  static async deleteCategory(id) {
    const response = await fetch(`${API_URL}/categories/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al eliminar la categoría');
    }

    return result.message;
  }

  static async changeOrder(direction, categoryId) {
    const response = await fetch(`${API_URL}/categories/change-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ direction: direction, category_id: categoryId }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al eliminar la categoría');
    }

    return result.data;
  }
}