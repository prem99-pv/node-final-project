import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach authorization token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clinic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clean invalid token
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('clinic_token');
        localStorage.removeItem('clinic_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
