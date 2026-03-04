import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  GraduationCap, LayoutDashboard, Users, BookOpen,
  School, ClipboardCheck, DollarSign, FileText,
  Library, Building2, UserCog, Settings, LogOut,
  ChevronLeft, Bell, Activity, Wrench, UserCheck,
} from "lucide-react";
import { cn } from "@/utils/cn";
import useUiStore from "@/store/uiStore";
import useAuthStore from "@/store/authStore";
import { authApi } from "@/api/authApi";
import {
  Tooltip, TooltipContent,
  TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"]
  },
  { label: "Students", icon: Users, path: "/students", roles: ["ADMIN", "TEACHER"] },
  { label: "Teachers", icon: UserCheck, path: "/teachers", roles: ["ADMIN"] },
  { label: "Classes", icon: School, path: "/classes", roles: ["ADMIN", "TEACHER"] },
  { label: "Timetable", icon: ClipboardCheck, path: "/timetable", roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { label: "Attendance", icon: ClipboardCheck, path: "/attendance", roles: ["ADMIN", "TEACHER"] },
  { label: "Fees", icon: DollarSign, path: "/fees", roles: ["ADMIN"] },
  { label: "Exams", icon: FileText, path: "/exams", roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"] },
  { label: "Library", icon: Library, path: "/library", roles: ["ADMIN", "STUDENT"] },
  { label: "Staff", icon: UserCog, path: "/staff", roles: ["ADMIN"] },
  { label: "Facilities", icon: Building2, path: "/facilities", roles: ["ADMIN"] },
  { label: "Parents", icon: Users, path: "/parents", roles: ["ADMIN"] },
  {
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
    roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"]
  },
  { label: "Activity Logs", icon: Activity, path: "/activity-logs", roles: ["ADMIN"] },
];

export default function Sidebar () {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const visibleItems = NAV_ITEMS.filter((item) =>
     item.roles.includes(user?.role)
  );
  
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { /* ignore */ } finally {
      logout();
      navigate("/login", { replace: true });
      toast.success("Logged out successfully");
    }
  };
  
  return (
     <TooltipProvider delayDuration={0}>
       <aside className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-gray-800",
          "border-r border-gray-200 dark:border-gray-700",
          "flex flex-col transition-all duration-300 z-40",
          sidebarOpen ? "w-64" : "w-16"
       )}>
         
         {/* Header */}
         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16">
           {sidebarOpen && (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
                  <GraduationCap className="w-5 h-5 text-white"/>
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">Skooly</span>
              </div>
           )}
           {!sidebarOpen && (
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 mx-auto">
                <GraduationCap className="w-5 h-5 text-white"/>
              </div>
           )}
           {sidebarOpen && (
              <button
                 onClick={toggleSidebar}
                 className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <ChevronLeft className="w-4 h-4"/>
              </button>
           )}
         </div>
         
         {/* Nav items */}
         <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
           {visibleItems.map((item) => (
              <NavItem
                 key={item.path}
                 item={item}
                 collapsed={!sidebarOpen}
              />
           ))}
         </nav>
         
         {/* Footer */}
         <div className="p-2 border-t border-gray-200 dark:border-gray-700 space-y-0.5">
           
           {/* Expand button when collapsed */}
           {!sidebarOpen && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                     onClick={toggleSidebar}
                     className="w-full flex items-center justify-center p-2.5 rounded-lg
                             text-gray-600 dark:text-gray-400
                             hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-5 h-5 rotate-180"/>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand</TooltipContent>
              </Tooltip>
           )}
           
           {/* Logout */}
           <Tooltip>
             <TooltipTrigger asChild>
               <button
                  onClick={handleLogout}
                  className={cn(
                     "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                     "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
                     "transition-colors duration-150",
                     !sidebarOpen && "justify-center px-2"
                  )}
               >
                 <LogOut className="w-5 h-5 shrink-0"/>
                 {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
               </button>
             </TooltipTrigger>
             {!sidebarOpen && <TooltipContent side="right">Logout</TooltipContent>}
           </Tooltip>
         </div>
       </aside>
     </TooltipProvider>
  );
}

function NavItem ({ item, collapsed }) {
  const { icon: Icon, label, path } = item;
  
  const baseClass = cn(
     "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
     "transition-colors duration-150",
     "text-gray-600 dark:text-gray-400",
     "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
     collapsed && "justify-center px-2"
  );
  
  const activeClass = cn(
     baseClass,
     "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
     "hover:bg-blue-50 dark:hover:bg-blue-900/30"
  );
  
  if (collapsed) {
    return (
       <TooltipProvider delayDuration={0}>
         <Tooltip>
           <TooltipTrigger asChild>
             <NavLink
                to={path}
                className={({ isActive }) => isActive ? activeClass : baseClass}
             >
               <Icon className="w-5 h-5 shrink-0"/>
             </NavLink>
           </TooltipTrigger>
           <TooltipContent side="right">{label}</TooltipContent>
         </Tooltip>
       </TooltipProvider>
    );
  }
  
  return (
     <NavLink
        to={path}
        className={({ isActive }) => isActive ? activeClass : baseClass}
     >
       <Icon className="w-5 h-5 shrink-0"/>
       <span className="truncate">{label}</span>
     </NavLink>
  );
}