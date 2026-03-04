import api from './axios'

export const facilityApi = {
  // Rooms
  getRooms:        (params)     => api.get('/rooms', { params }),
  getRoomById:     (id)         => api.get(`/rooms/${id}`),
  createRoom:      (data)       => api.post('/rooms', data),
  updateRoom:      (id, data)   => api.put(`/rooms/${id}`, data),
  deleteRoom:      (id)         => api.delete(`/rooms/${id}`),
  updateRoomStatus:(id, status) =>
     api.patch(`/rooms/${id}/status`, null, { params: { status } }),
  
  // Maintenance
  getMaintenance:        (params)     => api.get('/maintenance', { params }),
  getMaintenanceById:    (id)         => api.get(`/maintenance/${id}`),
  createMaintenance:     (data)       => api.post('/maintenance', data),
  updateMaintenance:     (id, data)   => api.put(`/maintenance/${id}`, data),
  deleteMaintenance:     (id)         => api.delete(`/maintenance/${id}`),
  updateMaintenanceStatus: (id, status) =>
     api.patch(`/maintenance/${id}/status`, null, { params: { status } }),
  
  // Inventory
  getInventory:    (params)     => api.get('/inventory', { params }),
  getInventoryById:(id)         => api.get(`/inventory/${id}`),
  createInventory: (data)       => api.post('/inventory', data),
  updateInventory: (id, data)   => api.put(`/inventory/${id}`, data),
  deleteInventory: (id)         => api.delete(`/inventory/${id}`),
}