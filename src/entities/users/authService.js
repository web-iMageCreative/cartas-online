const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export const authService = {
  // Login con email/contraseña
async register(name, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    return await response.json();
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Guardar token
      const token = data.data?.token || response.headers.get('X-Auth-Token');
      if (token) {
        localStorage.setItem('auth_token', token);
        // Configurar header por defecto para futuras peticiones
        this.setToken(token);
      }
    }

    return data;
  },

  // Login con Google - Obtener URL de autorización
  async getGoogleLoginUrl() {
    const response = await fetch(`${API_URL}/auth/google-login-url`);
    const data = await response.json();
    return data.data?.url;
  },

  // Verificar token en URL (callback de Google)
  handleGoogleCallback() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('auth_token', token);
      this.setToken(token);
      // Limpiar URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    
    return false;
  },

  // Configurar token para todas las peticiones
  setToken(token) {
    // Almacenar para uso futuro
    localStorage.setItem('auth_token', token);
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'X-Auth-Token': token,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }

    return null;
  },
};

// Interceptor para peticiones fetch
const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    options.headers = {
      ...options.headers,
      'X-Auth-Token': token,
    };
  }

  return originalFetch(url, options);
};