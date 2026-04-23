import axios from 'axios';

/* =========================
   BASE URL
========================= */
const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 🔥 increased timeout (AI + uploads can be slow)
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('foca_token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 🔥 AUTO DETECT FORM DATA (important for uploads)
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }

      if (import.meta.env.DEV) {
        console.log(
          `📡 ${config.method?.toUpperCase()} → ${config.baseURL}${config.url}`
        );
      }

      return config;
    } catch (err) {
      console.error('❌ Request setup error:', err);
      return config;
    }
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // 🌐 NETWORK ERROR
    if (!error.response) {
      console.error('🌐 NETWORK ERROR:', {
        message: error.message,
        url: error.config?.url,
      });

      return Promise.reject({
        type: 'network',
        message: 'Cannot reach server. Check if backend is running.',
      });
    }

    const { status, data } = error.response;

    console.error('🚨 API ERROR:', {
      status,
      message: data?.message,
      url: error.config?.url,
      method: error.config?.method,
      body: error.config?.data,
    });

    /* 🔐 AUTO LOGOUT */
    if (status === 401) {
      console.warn('🔐 Session expired');

      localStorage.removeItem('foca_token');
      localStorage.removeItem('foca_user');

      // optional redirect
      window.location.href = '/login';
    }

    /* ⏱️ TIMEOUT */
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        type: 'timeout',
        message: 'Request timed out. Try again.',
      });
    }

    /* 📦 CLEAN ERROR */
    return Promise.reject({
      type: 'api',
      status,
      message: data?.message || 'Something went wrong',
    });
  }
);

export default api;