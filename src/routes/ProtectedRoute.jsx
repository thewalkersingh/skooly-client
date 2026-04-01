import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

/**
 * ProtectedRoute — passthrough during development.
 * TODO: uncomment below when JWT is implemented
 *
 * import { useAuthStore } from '@/store/authStore'
 * import { Navigate } from 'react-router-dom'
 * const { isAuthenticated } = useAuthStore()
 * if (!isAuthenticated) return <Navigate to="/login" replace />
 */
// export default function ProtectedRoute() {
//   return <Outlet />
// }

export default function ProtectedRoute () {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/landing" replace/>;
  }
  
  return <Outlet/>;
}