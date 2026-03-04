import api from "./axios";

export const teacherApi = {
  getAll: (params) => api.get("/teachers", { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  getMe: () => api.get("/teachers/me"),
  create: (data) => api.post("/teachers", data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
  updateStatus: (id, status) => api.patch(`/teachers/${id}/status`, null, { params: { status } }),
  uploadPhoto: (id, file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post(`/teachers/${id}/photo`, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  deletePhoto: (id) => api.delete(`/teachers/${id}/photo`),
  assignSubject: (id, subjectId) =>
     api.post(`/teachers/${id}/subjects/${subjectId}`),
  removeSubject: (id, subjectId) =>
     api.delete(`/teachers/${id}/subjects/${subjectId}`),
};