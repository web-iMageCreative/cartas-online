const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class BusinessesServices {

  static async listBusinesses(userId) {
    const response = await fetch( `${API_URL}/businesses/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId })
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data;
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

    const response = await fetch(`${API_URL}/businesses/create`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }

  static async getBusinessBySlug( slug ) {
    if (!slug) return null;

    const response = await fetch(`${API_URL}/businesses/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug })
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data[0];
  }

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
    
    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result.data?.name;
  }
}