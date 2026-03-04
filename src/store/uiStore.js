import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUiStore = create(
   persist(
      (set) => ({
        sidebarOpen: true,
        theme: "light",
        
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
        setSidebar: (open) => set({ sidebarOpen: open }),
        
        toggleTheme: () => set((s) => {
          const next = s.theme === "light" ? "dark" : "light";
          document.documentElement.classList.toggle("dark", next === "dark");
          return { theme: next };
        }),
        
        initTheme: () => {
          const theme = localStorage.getItem("skooly-ui")
             ? JSON.parse(localStorage.getItem("skooly-ui")).state?.theme
             : "light";
          document.documentElement.classList.toggle("dark", theme === "dark");
        },
      }),
      { name: "skooly-ui" }
   )
);

export default useUiStore;