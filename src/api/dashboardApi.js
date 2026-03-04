import api from "./axios";

export const dashboardApi = {
  getStats: () => api.get("/students/count")
     .then(() => {})
     .catch(() => {}),
  
  // We'll aggregate from multiple endpoints
  getStudentCount: () => api.get("/students?page=1&size=1"),
  getTeacherCount: () => api.get("/teachers?page=1&size=1"),
  getStaffCount: () => api.get("/staff?page=1&size=1"),
  getFinanceSummary: () => api.get("/finance/summary"),
  getOverdueBooks: () => api.get("/library/issues/overdue"),
  getLowAttendance: () => api.get("/attendance/students/low?threshold=75"),
  getRecentLogs: () => api.get("/activity-logs?page=1&size=5"),
  getDefaulters: () => api.get("/finance/defaulters?page=1&size=5"),
  getPendingLeaves: () => api.get("/leave-requests?status=PENDING&page=1&size=5"),
  getOpenMaintenance: () => api.get("/maintenance?status=OPEN&page=1&size=5"),
};