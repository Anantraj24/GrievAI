import axios from 'axios';

// Backend URL — injected by Vercel/Render build env, falls back to local dev server
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000, // 30s — generous for Render free tier cold starts
});

// Request interceptor — attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle global 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const pathname = window.location.pathname;
      if (pathname !== '/login' && pathname !== '/register') {
        // Clear all auth state and force a fresh login
        localStorage.removeItem('access_token');
        // Use storage keys that match AuthContext
        localStorage.removeItem('grievai_current_user');
        localStorage.removeItem('grievai_current_role');
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  },
);
