import api from "./axios";

export const timetableApi = {
  getAll: (params) => api.get("/timetable", { params }),
  getById: (id) => api.get(`/timetable/${id}`),
  create: (data) => api.post("/timetable", data),
  createBulk: (data) => api.post("/timetable/bulk", data),
  update: (id, data) => api.put(`/timetable/${id}`, data),
  delete: (id) => api.delete(`/timetable/${id}`),
  getByClass: (classId, sectionId) =>
     api.get("/timetable", { params: { class_id: classId, section_id: sectionId } }),
  getByTeacher: (teacherId) =>
     api.get("/timetable", { params: { teacher_id: teacherId } }),
  getByDay: (day) =>
     api.get("/timetable", { params: { day } }),
};