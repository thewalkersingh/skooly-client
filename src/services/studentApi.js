import api from "./api";

const base = (schoolId) => `/schools/${schoolId}/students`;

export const studentApi = {
  getAll: (schoolId, search) => api.get(base(schoolId), { params: search ? { search } : {} }),
  getById: (schoolId, studentId) => api.get(`${base(schoolId)}/${studentId}`),
  getCount: (schoolId) => api.get(`${base(schoolId)}/count`),
  create: (schoolId, data) => api.post(base(schoolId), data),
  update: (schoolId, studentId, data) => api.put(`${base(schoolId)}/${studentId}`, data),
  delete: (schoolId, studentId) => api.delete(`${base(schoolId)}/${studentId}`),
};