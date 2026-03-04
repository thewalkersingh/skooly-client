import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
   persist(
      (set, get) => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuth: false,
        
        setAuth: (data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("refreshToken", data.refreshToken);
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            isAuth: true,
          });
        },
        
        logout: () => {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          set({ user: null, token: null, refreshToken: null, isAuth: false });
        },
        
        updateUser: (user) => set({ user }),
        
        // Role helpers
        isAdmin: () => get().user?.role === "ADMIN",
        isTeacher: () => get().user?.role === "TEACHER",
        isStudent: () => get().user?.role === "STUDENT",
        isParent: () => get().user?.role === "PARENT",
        isStaff: () => get().user?.role === "STAFF",
        
        hasRole: (role) => get().user?.role === role,
        hasAnyRole: (roles) => roles.includes(get().user?.role),
      }),
      {
        name: "skooly-auth",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuth: state.isAuth,
        }),
      }
   )
);

export default useAuthStore;