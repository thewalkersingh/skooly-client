import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/students": "Students",
  "/teachers": "Teachers",
  "/classes": "Classes & Subjects",
  "/timetable": "Timetable",
  "/attendance": "Attendance",
  "/fees": "Fees & Finance",
  "/exams": "Exams & Results",
  "/library": "Library",
  "/facilities": "Facilities",
  "/hr": "Staff / HR",
  "/parents": "Parents",
  "/notifications": "Notifications",
  "/activity-logs": "Activity Logs",
};

export default function AppShell () {
  const location = useLocation();
  
  const title =
     Object.entries(PAGE_TITLES).find(([path]) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
     )?.[1] ?? "Skooly";
  
  return (
     <div className="app-shell">
       <Sidebar/>
       <div className="app-main">
         <Header title={title}/>
         <main className="app-content">
           <Outlet/>
         </main>
       </div>
     </div>
  );
}