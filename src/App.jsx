import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import Providers from "./context/Provider.jsx";
import Header from "./components/Header/Header.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import SingleBlog from "./components/Blog/SingleBlog.jsx";
import Testimonials from "./components/Testimonials/Testimonials.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import SigninPage from "./pages/SigninPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import FeaturesPage from "./pages/FeaturesPage.jsx";

function App () {
  return (
     <Router>
       <Providers>
         <div className="w-full min-h-screen h-full bg-[#FCFCFC] dark:bg-black">
           <Header/>
           <Suspense fallback={<div>Loading...</div>}>
             <Routes>
               <Route path="/" element={<Home/>}/>
               <Route path="/about" element={<AboutPage/>}/>
               <Route path="/features" element={<FeaturesPage/>}/>
               <Route path="/pricing" element={<PricingPage/>}/>
               <Route path="/blog" element={<BlogPage/>}/>
               <Route path="/blog/:id" element={<SingleBlog/>}/>
               <Route path="/testimonials" element={<Testimonials/>}/>
               <Route path="/contact" element={<ContactPage/>}/>
               <Route path="/signin" element={<SigninPage/>}/>
               <Route path="/signup" element={<SignupPage/>}/>
             </Routes>
           </Suspense>
           
           <Footer/>
           <ScrollToTop/>
         </div>
       </Providers>
     </Router>
  );
}

export default App;