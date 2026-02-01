// src/services/assignmentService.jsx
import axios from 'axios';

// Safely load the env var
const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  console.warn('⚠️ VITE_API_BASE is not defined! Falling back to localhost.');
}
const BASE_URL = API_BASE || 'http://localhost:8080/api';

export const fetchAssignments = () =>
  axios.get(`${BASE_URL}/assignments`).then((res) => res.data);

export const fetchAssignmentsByCourse = (courseId) =>
  axios.get(`${BASE_URL}/assignments/course/${courseId}`).then((res) => res.data);

export const createAssignment = (assignment) =>
  axios.post(`${BASE_URL}/assignments`, assignment).then((res) => res.data);