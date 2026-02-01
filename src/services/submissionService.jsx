// src/services/submissionService.jsx
import axios from 'axios';

// Safely load the env var
const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  console.warn('⚠️ VITE_API_BASE is not defined! Falling back to localhost.');
}
const BASE_URL = API_BASE || 'http://localhost:8080/api';

export const fetchSubmissionsByAssignment = (assignmentId) =>
  axios.get(`${BASE_URL}/submissions/assignment/${assignmentId}`).then((res) => res.data);

export const fetchSubmissionsByStudent = (studentId) =>
  axios.get(`${BASE_URL}/submissions/student/${studentId}`).then((res) => res.data);

export const createSubmission = (submission) =>
  axios.post(`${BASE_URL}/submissions`, submission).then((res) => res.data);