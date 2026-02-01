// src/services/gradeService.jsx
import axios from 'axios';

// Safely load the env var
const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  console.warn('⚠️ VITE_API_BASE is not defined! Falling back to localhost.');
}
const BASE_URL = API_BASE || 'http://localhost:8080/api';

export const fetchGradesBySubmission = (submissionId) =>
  axios.get(`${BASE_URL}/grades/submission/${submissionId}`).then((res) => res.data);

export const submitGrade = (grade) =>
  axios.post(`${BASE_URL}/grades`, grade).then((res) => res.data);