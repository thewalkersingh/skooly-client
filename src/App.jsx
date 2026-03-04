import "./App.css";

import { useEffect } from "react";
import { Toaster } from "sonner";
import AppRouter from "@/routes/AppRouter";
import useUiStore from "@/store/uiStore";

export default function App () {
  const initTheme = useUiStore((s) => s.initTheme);
  
  useEffect(() => {
    initTheme();
  }, []);
  
  return (
     <>
       <AppRouter/>
       <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
       />
     </>
  );
}