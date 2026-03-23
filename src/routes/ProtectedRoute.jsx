import { Outlet } from 'react-router-dom'

/**
 * ProtectedRoute — passthrough during development.
 * TODO: uncomment below when JWT is implemented
 *
 * import { useAuthStore } from '@/store/authStore'
 * import { Navigate } from 'react-router-dom'
 * const { isAuthenticated } = useAuthStore()
 * if (!isAuthenticated) return <Navigate to="/login" replace />
 */
export default function ProtectedRoute() {
  return <Outlet />
}
