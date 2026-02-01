import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  console.warn('⚠️ VITE_API_BASE is not defined! Falling back to localhost.');
}
const BASE_URL = API_BASE || 'http://localhost:8080/api';

export const fetchCourses = () =>
  axios.get(`${BASE_URL}/courses/all`).then(response => response.data);

export const fetchCourseById = (id) =>
  axios.get(`${BASE_URL}/courses/${id}`).then(response => response.data);

export const createCourse = (course) =>
  axios.post(`${BASE_URL}/courses`, course).then(response => response.data);

export const updateCourse = (id, course) =>
  axios.put(`${BASE_URL}/courses/${id}`, course).then(response => response.data);

export const deleteCourse = (id) =>
  axios.delete(`${BASE_URL}/courses/${id}`).then(response => response.data);

// Fetch teachers and students for dropdown selection
export const fetchTeachers = () =>
  axios.get(`${BASE_URL}/teachers/all`).then(response => response.data);

export const fetchStudents = () =>
  axios.get(`${BASE_URL}/students`).then(response => response.data);