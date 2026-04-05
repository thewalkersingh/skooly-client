import api from "./api";

const base = (schoolId) => `/schools/${schoolId}/attendance`;

export const attendanceApi = {
  mark: (schoolId, data) => api.post(base(schoolId), data),
  getByClass: (schoolId, classId, date) => api.get(base(schoolId), { params: { classId, date } }),
  getByStudent: (schoolId, studentId) => api.get(`${base(schoolId)}/student/${studentId}`),
  getSummary: (schoolId) => api.get(`${base(schoolId)}/summary`),
  getRange: (schoolId, classId, from, to) => api.get(`${base(schoolId)}/range`, { params: { classId, from, to } }),
};