const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export default class CategoriesServices {
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
            throw new Error(result.message);
        }

        return result.message;
    }

    static async getCategoriesByMenuId(menu_id) {

        const response = await fetch(`${API_URL}/categories/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ menu_id: menu_id }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message);
        }

        return result.data[0];
    }
}