import useAuthStore from "@/store/authStore";

export function useAuth () {
  const {
    user, token, isAuth,
    setAuth, logout, updateUser,
    isAdmin, isTeacher, isStudent,
    isParent, isStaff, hasRole, hasAnyRole,
  } = useAuthStore();
  
  return {
    user, token, isAuth,
    setAuth, logout, updateUser,
    isAdmin: isAdmin(),
    isTeacher: isTeacher(),
    isStudent: isStudent(),
    isParent: isParent(),
    isStaff: isStaff(),
    hasRole, hasAnyRole,
  };
}