import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays,
  ClipboardCheck, DollarSign, Library, Building2, FileText,
  UserCog, Users2, Bell, Activity, ChevronLeft, School,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Students", path: "/students", icon: GraduationCap },
  { label: "Teachers", path: "/teachers", icon: Users },
  { label: "Classes", path: "/classes", icon: BookOpen },
  { label: "Timetable", path: "/timetable", icon: CalendarDays },
  { label: "Attendance", path: "/attendance", icon: ClipboardCheck },
  { label: "Fees", path: "/fees", icon: DollarSign },
  { label: "Exams & Results", path: "/exams", icon: FileText },
  { label: "Library", path: "/library", icon: Library },
  { label: "Facilities", path: "/facilities", icon: Building2 },
  { label: "Staff / HR", path: "/hr", icon: UserCog },
  { label: "Parents", path: "/parents", icon: Users2 },
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Activity Logs", path: "/activity-logs", icon: Activity },
];

export default function Sidebar () {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path) =>
     path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
  
  return (
     <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
       {/* Logo */}
       <div className="sidebar-logo">
         <div className="sidebar-logo-icon">
           <School/>
         </div>
         {!collapsed && <span className="sidebar-logo-text">Skooly</span>}
       </div>
       
       {/* Nav */}
       <nav className="sidebar-nav">
         {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
               key={path}
               to={path}
               title={collapsed ? label : undefined}
               className={`sidebar-nav-item${isActive(path) ? " active" : ""}`}
            >
              <Icon/>
              <span className="sidebar-nav-label">{label}</span>
            </NavLink>
         ))}
       </nav>
       
       {/* Collapse toggle */}
       <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
       >
         <ChevronLeft/>
       </button>
     </aside>
  );
}