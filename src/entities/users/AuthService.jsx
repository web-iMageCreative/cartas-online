const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export class AuthService {

  static async register(name, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('userData',  JSON.stringify(result.data.user));
    }

    return result;
  }

  static async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('userData',  JSON.stringify(result.data.user));
    }

    return result;
  }

  // Login con Google - Obtener URL de autorización
  static async getGoogleLoginUrl() {
    const response = await fetch(`${API_URL}/auth/google-login-url`);
    const data = await response.json();
    return data.data?.url;
  }

  static async forgotPassword(email) {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  }

  // Verificar token en URL (callback de Google)
  static handleGoogleCallback() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('authToken', token);
      this.setToken(token);
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    
    return false;
  }

  // Obtener token
  static getToken() {
    return localStorage.getItem('authToken');
  }

  static getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null; // Aquí: JSON.parse
   }

  // Cerrar sesión
  static logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }

  static async resetPassword(hash, password, password_repeat) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash, password, password_repeat }),
    });

    const data = await response.json();
    return data;
  }

  static async verifyResetPasswordHash(hash) {
    const response = await fetch(`${API_URL}/auth/verify-reset-password-hash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash }),
    });

    const data = await response.json();
    return data;
  }
};

// Interceptor para peticiones fetch
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    options.headers = {
      ...options.headers,
      'X-Auth-Token': token,
    };
  }

  return originalFetch(url, options);
};