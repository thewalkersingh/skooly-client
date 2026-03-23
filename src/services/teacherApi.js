import api from "./api";

const base = (schoolId) => `/schools/${schoolId}/teachers`;

export const teacherApi = {
  getAll: (schoolId, search) => api.get(base(schoolId), { params: search ? { search } : {} }),
  getById: (schoolId, teacherId) => api.get(`${base(schoolId)}/${teacherId}`),
  getCount: (schoolId) => api.get(`${base(schoolId)}/count`),
  create: (schoolId, data) => api.post(base(schoolId), data),
  update: (schoolId, teacherId, data) => api.put(`${base(schoolId)}/${teacherId}`, data),
  delete: (schoolId, teacherId) => api.delete(`${base(schoolId)}/${teacherId}`),
};