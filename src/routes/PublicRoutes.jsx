import React from "react";
import { Route, Routes } from "react-router-dom";
import Hero from "../components/Hero/Hero.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import SigninPage from "../pages/SigninPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";

// const SigninPage = React.lazy(() => import("../pages/SigninPage.jsx"));
// const SignupPage = React.lazy(() => import("../pages/SignupPage.jsx"));
// const ContactPage = React.lazy(() => import("../pages/ContactPage.jsx"));

export default function PublicRoutes () {
  return (
     <Routes>
       <Route path="/" element={<Hero/>}/>
       <Route path="/about" element={<AboutPage/>}/>
       
       <Route path="/login" element={<SigninPage/>}/>
       <Route path="/signup" element={<SignupPage/>}/>
       <Route path="/contact" element={<ContactPage/>}/>
       
       {/* Fallback */}
       <Route path="*" element={<Hero to="/" replace/>}/>
     </Routes>
  );
}