import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor — attach token ───────────────────────────────────────
axiosInstance.interceptors.request.use(
   (config) => {
     const token = localStorage.getItem("token");
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   },
   (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 ───────────────────────────────────────
axiosInstance.interceptors.response.use(
   (response) => response.data,
   async (error) => {
     const original = error.config;
     
     if (error.response?.status === 401 && !original._retry) {
       original._retry = true;
       
       try {
         const refreshToken = localStorage.getItem("refreshToken");
         if (!refreshToken) throw new Error("No refresh token");
         
         const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
           refreshToken,
         });
         
         const newToken = response.data.data.token;
         localStorage.setItem("token", newToken);
         original.headers.Authorization = `Bearer ${newToken}`;
         return axiosInstance(original);
       } catch {
         localStorage.removeItem("token");
         localStorage.removeItem("refreshToken");
         window.location.href = "/login";
         return Promise.reject(error);
       }
     }
     
     return Promise.reject(error);
   }
);

export default axiosInstance;