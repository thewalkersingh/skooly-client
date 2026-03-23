import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token here when auth is implemented
api.interceptors.request.use(
  (config) => {
    // TODO: attach real JWT token after auth is implemented
    // const token = useAuthStore.getState().token
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'
    // TODO: redirect to /login on 401 after JWT is implemented
    return Promise.reject(new Error(message))
  }
)

export default api
