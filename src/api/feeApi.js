import api from './axios'

export const feeApi = {
  // Categories
  getCategories:    (params)     => api.get('/fee-categories', { params }),
  createCategory:   (data)       => api.post('/fee-categories', data),
  updateCategory:   (id, data)   => api.put(`/fee-categories/${id}`, data),
  deleteCategory:   (id)         => api.delete(`/fee-categories/${id}`),
  
  // Structures
  getStructures:    (params)     => api.get('/fee-structures', { params }),
  createStructure:  (data)       => api.post('/fee-structures', data),
  updateStructure:  (id, data)   => api.put(`/fee-structures/${id}`, data),
  deleteStructure:  (id)         => api.delete(`/fee-structures/${id}`),
  
  // Payments
  getPayments:      (params)     => api.get('/fee-payments', { params }),
  getPaymentById:   (id)         => api.get(`/fee-payments/${id}`),
  createPayment:    (data)       => api.post('/fee-payments', data),
  updatePayment:    (id, data)   => api.put(`/fee-payments/${id}`, data),
  deletePayment:    (id)         => api.delete(`/fee-payments/${id}`),
  updateStatus:     (id, status) =>
     api.patch(`/fee-payments/${id}/status`, null, { params: { status } }),
  
  // Reports
  getFinanceSummary: (params)   => api.get('/finance/summary', { params }),
  getDefaulters:     (params)   => api.get('/finance/defaulters', { params }),
}