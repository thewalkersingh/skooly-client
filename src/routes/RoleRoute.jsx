import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

export default function RoleRoute ({ roles }) {
  const user = useAuthStore((s) => s.user);
  return roles.includes(user?.role)
     ? <Outlet/>
     : <Navigate to="/dashboard" replace/>;
}