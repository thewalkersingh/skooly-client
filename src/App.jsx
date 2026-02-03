import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "./app/RootLayout.jsx";
import Home from "./app/Home.jsx";
import SignupPage from "./app/signup/SignupPage.jsx";
import SigninPage from "./app/signin/SigninPage.jsx";
import BlogPage from "./app/blog/BlogPage.jsx";

// Route groups (each manages its own <Routes>)

export default function App () {
  return (
     <Router>
       <Routes>
         {/* Root layout wraps header/footer/scroll */}
         <Route path="/" element={<RootLayout><Home/></RootLayout>}/>
         <Route path="/signup" element={<RootLayout><SignupPage/></RootLayout>}/>
         <Route path="/signin" element={<RootLayout><SigninPage/></RootLayout>}/>
         <Route path="/blog" element={<RootLayout><BlogPage/></RootLayout>}/>
       </Routes>
     
     </Router>
  );
}