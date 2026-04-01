import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { School, ChevronRight, Building2 } from "lucide-react";
import { schoolApi } from "@/services/schoolApi";
import { useAuthStore } from "@/store/authStore";
import "./landing.css";

export default function LandingPage () {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selecting, setSelecting] = useState(null); // id of school being selected
  
  useEffect(() => {
    schoolApi.getAll()
       .then((res) => {
         const data = Array.isArray(res.data) ? res.data : res.data.content ?? [];
         setSchools(data);
       })
       .catch((err) => setError(err.message))
       .finally(() => setLoading(false));
  }, []);
  
  const handleSelect = async (school) => {
    setSelecting(school.id);
    // Update auth store with selected school
    await login({
      id: 1,
      username: "admin",
      role: "ADMIN",
      schoolId: school.id,
      schoolName: school.name,
    });
    navigate("/");
  };
  
  return (
     <div className="landing-page">
       {/* Logo */}
       <div className="landing-logo">
         <div className="landing-logo-icon">
           <School/>
         </div>
         <span className="landing-logo-text">Skooly</span>
       </div>
       <p className="landing-tagline">School Management System</p>
       
       {/* Card */}
       <div className="landing-card">
         <h2 className="landing-card-title">Select Your School</h2>
         <p className="landing-card-subtitle">Choose a school below to continue to the dashboard.</p>
         
         {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <div className="spinner"/>
            </div>
         ) : error ? (
            <div className="landing-empty">
              <Building2/>
              <p style={{ color: "var(--danger)", fontWeight: 500 }}>Failed to load schools</p>
              <p style={{ marginTop: 4 }}>{error}</p>
            </div>
         ) : schools.length === 0 ? (
            <div className="landing-empty">
              <Building2/>
              <p>No schools found. Please add a school first.</p>
            </div>
         ) : (
            <div className="school-list">
              {schools.map((school) => (
                 <button
                    key={school.id}
                    className="school-item"
                    onClick={() => handleSelect(school)}
                    disabled={selecting === school.id}
                 >
                   <div className="school-item-icon">
                     <School/>
                   </div>
                   <div className="school-item-info">
                     <div className="school-item-name">{school.name}</div>
                     <div className="school-item-meta">
                       {school.code && <span>Code: {school.code}</span>}
                       {school.email && <span style={{ marginLeft: 10 }}>{school.email}</span>}
                     </div>
                   </div>
                   {selecting === school.id
                      ? <div className="spinner" style={{ width: 16, height: 16 }}/>
                      : <ChevronRight className="school-item-arrow"/>
                   }
                 </button>
              ))}
            </div>
         )}
       </div>
       
       <p className="landing-footer">© {new Date().getFullYear()} Skooly. All rights reserved.</p>
     </div>
  );
}