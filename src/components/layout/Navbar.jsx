import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Moon, Sun, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import useUiStore from "@/store/uiStore";
import useAuthStore from "@/store/authStore";
import { getInitials } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export default function Navbar () {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const theme = useUiStore((s) => s.theme);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  
  return (
     <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 gap-4 shrink-0 z-30">
       
       {/* Left — menu toggle + search */}
       <div className="flex items-center gap-3 flex-1">
         <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 md:hidden"
         >
           <Menu className="w-5 h-5"/>
         </button>
         
         <div className="relative max-w-sm w-full hidden sm:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
           <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-gray-50 dark:bg-gray-700 border-gray-200"
           />
         </div>
       </div>
       
       {/* Right — theme, notifications, profile */}
       <div className="flex items-center gap-2">
         
         {/* Theme toggle */}
         <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
         >
           {theme === "light"
              ? <Moon className="w-5 h-5"/>
              : <Sun className="w-5 h-5"/>
           }
         </button>
         
         {/* Notifications */}
         <button
            onClick={() => navigate("/notifications")}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
         >
           <Bell className="w-5 h-5"/>
           {/* Unread badge */}
           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>
         </button>
         
         {/* Profile dropdown */}
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
               <Avatar className="w-8 h-8">
                 <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                   {getInitials(user?.username, "")}
                 </AvatarFallback>
               </Avatar>
               <div className="hidden sm:block text-left">
                 <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">
                   {user?.username}
                 </p>
                 <p className="text-xs text-muted-foreground mt-0.5">
                   {user?.role}
                 </p>
               </div>
             </button>
           </DropdownMenuTrigger>
           
           <DropdownMenuContent align="end" className="w-48">
             <DropdownMenuLabel>My Account</DropdownMenuLabel>
             <DropdownMenuSeparator/>
             <DropdownMenuItem onClick={() => navigate("/profile")}>
               Profile
             </DropdownMenuItem>
             <DropdownMenuItem onClick={() => navigate("/notifications")}>
               Notifications
             </DropdownMenuItem>
             <DropdownMenuSeparator/>
             <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 focus:text-red-500"
             >
               Logout
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       
       </div>
     </header>
  );
}