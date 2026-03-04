import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import AppLayout from "@/components/layout/AppLayout";

// Auth
import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// Pages
import DashboardPage from "@/pages/dashboard/DashboardPage";
import StudentsPage from "@/pages/students/StudentsPage";
import StudentDetailPage from "@/pages/students/StudentDetailPage";
import StudentFormPage from "@/pages/students/StudentFormPage";
import TeachersPage from "@/pages/teachers/TeachersPage";
import TeacherDetailPage from "@/pages/teachers/TeacherDetailPage";
import TeacherFormPage from "@/pages/teachers/TeacherFormPage";
import ClassesPage from "@/pages/classes/ClassesPage";
import ClassDetailPage from "@/pages/classes/ClassDetailPage";
import TimetablePage from "@/pages/classes/TimetablePage";
import AttendancePage from "@/pages/attendance/AttendancePage";
import MarkAttendancePage from "@/pages/attendance/MarkAttendancePage";
import FeesPage from "@/pages/fees/FeesPage";
import FeePaymentPage from "@/pages/fees/FeePaymentPage";
import FinanceSummaryPage from "@/pages/fees/FinanceSummaryPage";
import ExamsPage from "@/pages/exams/ExamsPage";
import ExamDetailPage from "@/pages/exams/ExamDetailPage";
import EnterResultsPage from "@/pages/exams/EnterResultsPage";
import ReportCardPage from "@/pages/exams/ReportCardPage";
import LibraryPage from "@/pages/library/LibraryPage";
import IssuedBooksPage from "@/pages/library/IssuedBooksPage";
import StaffPage from "@/pages/staff/StaffPage";
import StaffDetailPage from "@/pages/staff/StaffDetailPage";
import LeaveRequestsPage from "@/pages/staff/LeaveRequestsPage";
import PayrollPage from "@/pages/staff/PayrollPage";
import FacilitiesPage from "@/pages/facilities/FacilitiesPage";
import RoomsPage from "@/pages/facilities/RoomsPage";
import MaintenancePage from "@/pages/facilities/MaintenancePage";
import ParentsPage from "@/pages/parents/ParentsPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import ActivityLogsPage from "@/pages/activity-logs/ActivityLogsPage";

export default function AppRouter () {
  return (
     <BrowserRouter>
       <Routes>
         
         {/* Public routes */}
         <Route path="/login" element={<LoginPage/>}/>
         <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
         <Route path="/reset-password" element={<ResetPasswordPage/>}/>
         
         {/* Protected routes */}
         <Route element={<ProtectedRoute/>}>
           <Route element={<AppLayout/>}>
             
             <Route index element={<Navigate to="/dashboard" replace/>}/>
             <Route path="/dashboard" element={<DashboardPage/>}/>
             
             {/* Students */}
             <Route path="/students" element={<StudentsPage/>}/>
             <Route path="/students/new" element={<StudentFormPage/>}/>
             <Route path="/students/:id" element={<StudentDetailPage/>}/>
             <Route path="/students/:id/edit" element={<StudentFormPage/>}/>
             
             {/* Teachers */}
             <Route path="/teachers" element={<TeachersPage/>}/>
             <Route path="/teachers/new" element={<TeacherFormPage/>}/>
             <Route path="/teachers/:id" element={<TeacherDetailPage/>}/>
             <Route path="/teachers/:id/edit" element={<TeacherFormPage/>}/>
             
             {/* Classes */}
             <Route path="/classes" element={<ClassesPage/>}/>
             <Route path="/classes/:id" element={<ClassDetailPage/>}/>
             <Route path="/timetable" element={<TimetablePage/>}/>
             
             {/* Attendance */}
             <Route path="/attendance" element={<AttendancePage/>}/>
             <Route path="/attendance/mark" element={<MarkAttendancePage/>}/>
             
             {/* Fees */}
             <Route path="/fees" element={<FeesPage/>}/>
             <Route path="/fees/payment" element={<FeePaymentPage/>}/>
             <Route path="/fees/summary" element={<FinanceSummaryPage/>}/>
             
             {/* Exams */}
             <Route path="/exams" element={<ExamsPage/>}/>
             <Route path="/exams/:id" element={<ExamDetailPage/>}/>
             <Route path="/exams/:id/results" element={<EnterResultsPage/>}/>
             <Route path="/report-card/:studentId" element={<ReportCardPage/>}/>
             
             {/* Library */}
             <Route path="/library" element={<LibraryPage/>}/>
             <Route path="/library/issued" element={<IssuedBooksPage/>}/>
             
             {/* Staff */}
             <Route path="/staff" element={<StaffPage/>}/>
             <Route path="/staff/:id" element={<StaffDetailPage/>}/>
             <Route path="/leave-requests" element={<LeaveRequestsPage/>}/>
             <Route path="/payroll" element={<PayrollPage/>}/>
             
             {/* Facilities */}
             <Route path="/facilities" element={<FacilitiesPage/>}/>
             <Route path="/rooms" element={<RoomsPage/>}/>
             <Route path="/maintenance" element={<MaintenancePage/>}/>
             
             {/* Parents */}
             <Route path="/parents" element={<ParentsPage/>}/>
             
             {/* Notifications */}
             <Route path="/notifications" element={<NotificationsPage/>}/>
             
             {/* Admin only */}
             <Route element={<RoleRoute roles={["ADMIN"]}/>}>
               <Route path="/activity-logs" element={<ActivityLogsPage/>}/>
             </Route>
           
           </Route>
         </Route>
         
         {/* Fallback */}
         <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
       
       </Routes>
     </BrowserRouter>
  );
}