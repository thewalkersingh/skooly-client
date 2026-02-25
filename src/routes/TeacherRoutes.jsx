// import {Route, Routes} from "react-router-dom";
// import React from "react";
// import MarkAttendance from "../components/Attendance/MarkAttendance.jsx";
// import AttendanceList from "../components/Attendance/AttendanceList.jsx";
//
// const TeacherList = React.lazy(() => import('../components/Teacher/TeacherList'));
// const TeacherForm = React.lazy(() => import('../components/Teacher/TeacherForm'));
//
// export default function TeacherRoutes() {
//   return (
//     <Routes>
//       <Route path="/teachers" element={<TeacherList/>}/>
//       <Route path="/teachers/new" element={<TeacherForm/>}/>
//       <Route path="/teachers/:id/edit" element={<TeacherForm/>}/>
//
//       <Route path="/attendance" element={<AttendanceList/>}/>
//       <Route path="/attendance/new" element={<MarkAttendance/>}/>
//     </Routes>
//   )
// }