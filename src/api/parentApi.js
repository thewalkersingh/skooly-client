import api from "./axios";

export const parentApi = {
  getAll: (params) => api.get("/parents", { params }),
  getById: (id) => api.get(`/parents/${id}`),
  getMe: () => api.get("/parents/me"),
  create: (data) => api.post("/parents", data),
  update: (id, data) => api.put(`/parents/${id}`, data),
  delete: (id) => api.delete(`/parents/${id}`),
  updateStatus: (id, status) =>
     api.patch(`/parents/${id}/status`, null, { params: { status } }),
  uploadPhoto: (id, file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post(`/parents/${id}/photo`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  linkStudent: (id, studentId) =>
     api.post(`/parents/${id}/students/${studentId}`),
  unlinkStudent: (id, studentId) =>
     api.delete(`/parents/${id}/students/${studentId}`),
  getChildren: (id) => api.get(`/parents/${id}/students`),
};