const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export const authService = {

async register(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('authToken', data.token);
  }

  return data;
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
      localStorage.setItem('authToken', data.token);
    }

    return data;
  },

  // Login con Google - Obtener URL de autorización
  async getGoogleLoginUrl() {
    const response = await fetch(`${API_URL}/auth/google-login-url`);
    const data = await response.json();
    return data.data?.url;
  },

  async forgotPassword(email) {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  },

  // Verificar token en URL (callback de Google)
  handleGoogleCallback() {
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
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('authToken');
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

  async resetPassword(hash, password, password_repeat) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash, password, password_repeat }),
    });

    const data = await response.json();
    return data;
  },

  async verifyResetPasswordHash(hash) {
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
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    options.headers = {
      ...options.headers,
      'X-Auth-Token': token,
    };
  }

  return originalFetch(url, options);
};