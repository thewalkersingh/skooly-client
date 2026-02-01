import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import LandingPage from "../pages/landingPage/LandingPage.jsx";
import About from "../pages/About.jsx";

const Login = React.lazy(() => import('../pages/login/Login.jsx'));
const Signup = React.lazy(() => import('../pages/signup/Signup.jsx'));
const Contact = React.lazy(() => import('../components/Contact/Contact'));

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/about" element={<About/>}/>
      
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/contact" element={<Contact/>}/>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}