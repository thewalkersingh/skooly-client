import api from "./axios";

export const libraryApi = {
  // Books
  getBooks: (params) => api.get("/library/books", { params }),
  getBookById: (id) => api.get(`/library/books/${id}`),
  createBook: (data) => api.post("/library/books", data),
  updateBook: (id, data) => api.put(`/library/books/${id}`, data),
  deleteBook: (id) => api.delete(`/library/books/${id}`),
  
  // Issues
  getIssues: (params) => api.get("/library/issues", { params }),
  getIssueById: (id) => api.get(`/library/issues/${id}`),
  issueBook: (data) => api.post("/library/issues", data),
  returnBook: (id) => api.patch(`/library/issues/${id}/return`),
  getOverdue: (params) => api.get("/library/issues/overdue", { params }),
  getFines: (params) => api.get("/library/fines", { params }),
  payFine: (id) => api.patch(`/library/issues/${id}/pay-fine`),
};