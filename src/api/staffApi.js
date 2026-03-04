import api from "./axios";

export const staffApi = {
  // Staff
  getAll: (params) => api.get("/staff", { params }),
  getById: (id) => api.get(`/staff/${id}`),
  getMe: () => api.get("/staff/me"),
  create: (data) => api.post("/staff", data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
  updateStatus: (id, status) =>
     api.patch(`/staff/${id}/status`, null, { params: { status } }),
  uploadPhoto: (id, file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post(`/staff/${id}/photo`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  
  // Leave Requests
  getLeaves: (params) => api.get("/leave-requests", { params }),
  getLeaveById: (id) => api.get(`/leave-requests/${id}`),
  createLeave: (data) => api.post("/leave-requests", data),
  updateLeave: (id, data) => api.put(`/leave-requests/${id}`, data),
  deleteLeave: (id) => api.delete(`/leave-requests/${id}`),
  approveLeave: (id) => api.patch(`/leave-requests/${id}/approve`),
  rejectLeave: (id, reason) =>
     api.patch(`/leave-requests/${id}/reject`, null, { params: { reason } }),
  
  // Payroll
  getPayrolls: (params) => api.get("/payroll", { params }),
  getPayrollById: (id) => api.get(`/payroll/${id}`),
  createPayroll: (data) => api.post("/payroll", data),
  updatePayroll: (id, data) => api.put(`/payroll/${id}`, data),
  deletePayroll: (id) => api.delete(`/payroll/${id}`),
  processPayroll: (id) => api.patch(`/payroll/${id}/process`),
};