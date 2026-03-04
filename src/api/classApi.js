import api from "./axios";

export const classApi = {
  // Classes
  getAll: (params) => api.get("/classes", { params }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post("/classes", data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  
  // Sections
  getSections: (classId) => api.get(`/classes/${classId}/sections`),
  createSection: (data) => api.post("/sections", data),
  updateSection: (id, data) => api.put(`/sections/${id}`, data),
  deleteSection: (id) => api.delete(`/sections/${id}`),
  assignTeacher: (id, teacherId) =>
     api.patch(`/sections/${id}/teacher`, null, { params: { teacherId } }),
};