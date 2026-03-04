import api from "./axios";

export const attendanceApi = {
  // Student Attendance
  markAttendance: (data) => api.post("/attendance/students", data),
  markBulkAttendance: (data) => api.post("/attendance/students/bulk", data),
  updateAttendance: (id, data) => api.put(`/attendance/students/${id}`, data),
  deleteAttendance: (id) => api.delete(`/attendance/students/${id}`),
  getClassAttendance: (params) => api.get("/attendance/students", { params }),
  getStudentMonthly: (studentId, params) =>
     api.get(`/attendance/students/${studentId}/monthly`, { params }),
  getStudentSummary: (studentId, params) =>
     api.get(`/attendance/students/${studentId}/summary`, { params }),
  getLowAttendance: (params) =>
     api.get("/attendance/students/low", { params }),
  
  // Teacher Attendance
  markTeacherAttendance: (data) => api.post("/attendance/teachers", data),
  markBulkTeacherAttendance: (data) => api.post("/attendance/teachers/bulk", data),
  getTeacherMonthly: (teacherId, params) =>
     api.get(`/attendance/teachers/${teacherId}/monthly`, { params }),
};