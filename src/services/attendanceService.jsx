import axios from 'axios';

// Safely load the env var
const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  console.warn('⚠️ VITE_API_BASE is not defined! Falling back to localhost.');
}
const BASE_URL = API_BASE || 'http://localhost:8080/api';

export const fetchAttendanceRecords = () =>
  axios.get(`${BASE_URL}/attendance`).then(response => response.data);

export const fetchAttendanceByStudent = (studentId) =>
  axios.get(`${BASE_URL}/attendance/student/${studentId}`).then(response => response.data);

export const fetchAttendanceByDate = (date) =>
  axios.get(`${BASE_URL}/attendance/date/${date}`).then(response => response.data);

export const markAttendance = (attendance) =>
  axios.post(`${BASE_URL}/attendance`, attendance).then(response => response.data);