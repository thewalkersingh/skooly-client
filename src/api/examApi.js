import api from "./axios";

export const examApi = {
  // Exams
  getAll: (params) => api.get("/exams", { params }),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post("/exams", data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
  
  // Results
  getResultsByExam: (examId, params) =>
     api.get(`/exams/${examId}/results`, { params }),
  getResultsByStudent: (studentId, params) =>
     api.get(`/results/student/${studentId}`, { params }),
  createResult: (data) => api.post("/results", data),
  createBulkResults: (data) => api.post("/results/bulk", data),
  updateResult: (id, data) => api.put(`/results/${id}`, data),
  deleteResult: (id) => api.delete(`/results/${id}`),
  
  // Grade Scale
  getGradeScales: () => api.get("/grade-scales"),
  createGradeScale: (data) => api.post("/grade-scales", data),
  updateGradeScale: (id, data) => api.put(`/grade-scales/${id}`, data),
  deleteGradeScale: (id) => api.delete(`/grade-scales/${id}`),
  
  // Reports
  getReportCard: (studentId, params) =>
     api.get(`/results/report-card/${studentId}`, { params }),
  getExamStatistics: (examId) => api.get(`/exams/${examId}/statistics`),
};