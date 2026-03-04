import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useUiStore from "@/store/uiStore";
import { cn } from "@/utils/cn";

export default function AppLayout () {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  
  return (
     <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
       
       {/* Sidebar */}
       <Sidebar/>
       
       {/* Main content */}
       <div className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
       )}>
         {/* Top navbar */}
         <Navbar/>
         
         {/* Page content */}
         <main className="flex-1 overflow-y-auto p-6">
           <Outlet/>
         </main>
       </div>
     </div>
  );
}