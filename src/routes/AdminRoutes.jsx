import {Route, Routes} from "react-router-dom";
import React from "react";
import ManageSchools from "../components/Admin/ManageSchools.jsx";
import ManageTeachers from "../components/Admin/ManageTeachers.jsx";
import ManageStudents from "../components/Admin/ManageStudents.jsx";
import FeeManagement from "../components/Admin/FeeManagement.jsx";
import AdminDashboard from "../components/Admin/AdminDashboard.jsx";
import DashboardOverview from "../components/Admin/DashboardOverview.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      {/*<Route path="/admin" element={<Admin/>}/>*/}
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard/>}>
        <Route path="dashboard" element={<DashboardOverview/>}/>
        <Route path="fees" element={<FeeManagement/>}/>
        <Route path="students" element={<ManageStudents/>}/>
        <Route path="teachers" element={<ManageTeachers/>}/>
        <Route path="schools" element={<ManageSchools/>}/>
      </Route>
    </Routes>
  )
}