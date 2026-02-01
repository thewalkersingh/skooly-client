import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  console.warn('⚠️ VITE_API_BASE is not defined! Falling back to localhost.');
}
const BASE_URL = API_BASE || 'http://localhost:8080/api';

export const fetchSchools = () =>
  axios.get(`${BASE_URL}/schools/all`).then(res => res.data);

export const createSchool = (school) =>
  axios.post(`${BASE_URL}/schools`, school).then(res => res.data);

export const updateSchool = (id, school) =>
  axios.put(`${BASE_URL}/schools/${id}`, school).then(res => res.data);

export const deleteSchool = (id) =>
  axios.delete(`${BASE_URL}/schools/${id}`);

export const createSchoolsBatch = (schools) =>
  axios.post(`${BASE_URL}/schools/batch`, schools).then(res => res.data);