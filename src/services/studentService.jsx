import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  console.warn('⚠️ VITE_API_BASE is not defined! Falling back to localhost.');
}
const BASE_URL = API_BASE || 'http://localhost:8080/api';

export const fetchStudents = () =>
  axios.get(`${BASE_URL}/students`).then(response => response.data);

export const createStudent = (student) =>
  axios.post(`${BASE_URL}/students`, student).then(response => response.data);

export const updateStudent = (id, student) =>
  axios.put(`${BASE_URL}/students/${id}`, student).then(response => response.data);

export const deleteStudent = (id) =>
  axios.delete(`${BASE_URL}/students/${id}`).then(response => response.data);

// If needed: batch creation (returns a success message)
export const createStudentsBatch = (students) =>
  axios.post(`${BASE_URL}/students/batch`, students).then(response => response.data);