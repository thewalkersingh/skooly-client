// src/api/classApi.js
import api from "./axios";

export const classApi = {
  getAll: (params) => api.get("/classes", { params }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post("/classes", data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  getSections: (classId) => api.get(`/classes/${classId}/sections`),
};