import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://logs-server-system-production.up.railway.app/api",
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token"); // Changed from "token" to "auth_token"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("auth_token"); // Changed from "token" to "auth_token"
      localStorage.removeItem("user_data"); // Changed from "user" to "user_data"
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;