import api from "./axios";

export const subjectApi = {
  getAll: (params) => api.get("/subjects", { params }),
  getById: (id) => api.get(`/subjects/${id}`),
  getByClass: (classId) => api.get("/subjects/by-class", { params: { classId } }),
  create: (data) => api.post("/subjects", data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};