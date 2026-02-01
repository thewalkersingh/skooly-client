import React, {Suspense} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

// Route groups (each manages its own <Routes>)
import TeacherRoutes from "./routes/TeacherRoutes.jsx";
import StudentRoutes from "./routes/StudentRoutes.jsx";
import PublicRoutes from "./routes/PublicRoutes.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import SchoolRoutes from "./routes/SchoolRoutes.jsx";

function App() {
  // Suppose you get studentId from user authentication state.
  const studentId = 1; // or use your actual logic to fetch the student's ID
  const teacherId = 2;
  return (
    <Router>
      <Navbar/>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        {/* Public routes */}
        <PublicRoutes/>
        
        {/* Student routes */}
        <StudentRoutes studentId={studentId}/>
        
        {/* Teacher routes */}
        <TeacherRoutes teacherId={teacherId}/>
        
        {/* Admin routes */}
        <AdminRoutes/>
        
        {/* School routes */}
        <SchoolRoutes/>
      
      </Suspense>
      <Footer/>
    </Router>
  );
}

export default App;