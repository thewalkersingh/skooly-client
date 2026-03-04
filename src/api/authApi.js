import api from "./axios";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  refreshToken: (data) => api.post("/auth/refresh-token", data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  changePassword: (data) => api.post("/auth/change-password", data),
  getMe: () => api.get("/users/me"),
};