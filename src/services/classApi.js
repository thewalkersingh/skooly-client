import api from "./api";

export const classApi = {
  getAll: (schoolId) => api.get(`/schools/${schoolId}/classes`),
  create: (schoolId, data) => api.post(`/schools/${schoolId}/classes`, data),
  update: (schoolId, id, data) => api.put(`/schools/${schoolId}/classes/${id}`, data),
  delete: (schoolId, id) => api.delete(`/schools/${schoolId}/classes/${id}`),
  
  getAllSections: (schoolId) => api.get(`/schools/${schoolId}/sections`),
  getSectionsByClass: (schoolId, classId) => api.get(`/schools/${schoolId}/classes/${classId}/sections`),
  createSection: (schoolId, data) => api.post(`/schools/${schoolId}/sections`, data),
  deleteSection: (schoolId, id) => api.delete(`/schools/${schoolId}/sections/${id}`),
  
  getAllSubjects: (schoolId) => api.get(`/schools/${schoolId}/subjects`),
};