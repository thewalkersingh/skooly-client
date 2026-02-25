// import {Route, Routes} from "react-router-dom";
// import AssignmentList from "../components/Assignments/AssignmentList";
// import AssignmentForm from "../components/Assignments/AssignmentForm";
// import SubmissionForm from "../components/Submissions/SubmissionForm";
// import GradeForm from "../components/Grades/GradeForm";
// import FeeDashboard from "../components/Fee/FeeDashboard";
// import React from "react";
//
// const StudentList = React.lazy(() => import('../components/Student/StudentList'));
// const StudentForm = React.lazy(() => import('../components/Student/StudentForm'));
//
// export default function StudentRoutes({studentId}) {
//   return (
//     <Routes>
//       <Route path="/students" element={<StudentList/>}/>
//       <Route path="/students/new" element={<StudentForm/>}/>
//       <Route path="/students/:id/edit" element={<StudentForm/>}/>
//
//       <Route path="/assignments" element={<AssignmentList/>}/>
//       <Route path="/assignments/new" element={<AssignmentForm/>}/>
//
//       <Route path="/submissions/new" element={<SubmissionForm/>}/>
//       <Route path="/grades/new" element={<GradeForm/>}/>
//
//       <Route path="/student/fees" element={<FeeDashboard studentId={studentId}/>}/>
//
//     </Routes>
//   );
// }