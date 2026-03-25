import axios from "axios";

// Use environment variable for base URL
// In local dev: VITE_API_BASE_URL=http://localhost:8080
// In production (Vercel): VITE_API_BASE_URL=https://skooly-backend.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: "${API_BASE_URL}/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token here when auth is implemented
api.interceptors.request.use(
   (config) => {
     // TODO: attach real JWT token after auth is implemented
     // const token = useAuthStore.getState().token
     // if (token) config.headers.Authorization = `Bearer ${token}`
     return config;
   },
   (error) => Promise.reject(error)
);

// Response interceptor — global error handling
api.interceptors.response.use(
   (response) => response,
   (error) => {
     const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong";
     // TODO: redirect to /login on 401 after JWT is implemented
     return Promise.reject(new Error(message));
   }
);

export default api;