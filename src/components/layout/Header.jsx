import { Bell, ChevronDown, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Header ({ title }) {
  const { user } = useAuthStore();
  
  return (
     <header className="header">
       <h1 className="header-title">{title}</h1>
       <div className="header-right">
         
         {/* School badge */}
         <span className="header-school-badge">
          {user?.schoolName ?? "Demo School"}
        </span>
         
         {/* Notifications */}
         <button className="header-icon-btn">
           <Bell/>
           <span className="header-notif-dot"/>
         </button>
         
         {/* User */}
         <div className="header-user">
           <div className="header-avatar">
             <User/>
           </div>
           <div className="header-user-info">
             <span className="header-user-name">{user?.username ?? "Admin"}</span>
             <span className="header-user-role">{user?.role ?? "ADMIN"}</span>
           </div>
           <ChevronDown className="header-chevron"/>
         </div>
       </div>
     </header>
  );
}