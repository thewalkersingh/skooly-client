import api from "./axios";

export const studentApi = {
  getAll: (params) => api.get("/students", { params }),
  getById: (id) => api.get(`/students/${id}`),
  getMe: () => api.get("/students/me"),
  create: (data) => api.post("/students", data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  updateStatus: (id, status) => api.patch(`/students/${id}/status`, null, { params: { status } }),
  uploadPhoto: (id, file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post(`/students/${id}/photo`, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  deletePhoto: (id) => api.delete(`/students/${id}/photo`),
};