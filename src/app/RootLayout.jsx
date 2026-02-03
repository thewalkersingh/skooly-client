import * as React from "react";
// Route groups (each manages its own <Routes>)
import ScrollToTop from "../components/ScrollToTop/ScrollToTop.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Header from "../components/Header/Header.jsx";
import Home from "./Home";

export default function RootLayout ({ children }) {
  
  return (
     <div
        style={{
          backgroundColor: "#FCFCFC",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
        className="light-theme dark-theme"
     >
       
       <Header/>
       <main style={{ flex: "1" }}>{children}</main>
       {/* children or Home component */}
       <Home/>
       <Footer/>
       <ScrollToTop/>
     </div>
  );
}