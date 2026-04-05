import api from "./api";

const base = (schoolId) => `/schools/${schoolId}/library`;

export const libraryApi = {
  // Books
  getAllBooks: (schoolId, search) =>
     api.get(`${base(schoolId)}/books`, { params: search ? { search } : {} }),
  createBook: (schoolId, data) => api.post(`${base(schoolId)}/books`, data),
  updateBook: (schoolId, id, data) => api.put(`${base(schoolId)}/books/${id}`, data),
  deleteBook: (schoolId, id) => api.delete(`${base(schoolId)}/books/${id}`),
  
  // Issues
  getAllIssues: (schoolId, search) =>
     api.get(`${base(schoolId)}/issues`, { params: search ? { search } : {} }),
  issueBook: (schoolId, data) => api.post(`${base(schoolId)}/issues`, data),
  returnBook: (schoolId, id) => api.patch(`${base(schoolId)}/issues/${id}/return`),
  deleteIssue: (schoolId, id) => api.delete(`${base(schoolId)}/issues/${id}`),
};