import React from 'react';
import {Link} from 'react-router-dom';
import '../../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Left Side: Logo */}
      <div className="nav-left">
        <Link to="/">
          <img src="/logo.png" alt="Skooly Logo" className="logo"/>
        </Link>
      </div>
      
      {/* Center: Main Navigation Menu */}
      <div className="nav-center">
        <ul className="nav-menu">
          <li className="nav-item dropdown">
            <span>School</span>
            <ul className="dropdown-menu">
              <li><Link to="/schools">Schools</Link></li>
              <li><Link to="/sports">Sports</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/facilities">Facilities</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <span>Student</span>
            <ul className="dropdown-menu">
              <li><Link to="/students">Students</Link></li>
              <li><Link to="/assignments">Assignments</Link></li>
              <li><Link to="/submissions">Submissions</Link></li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <span>Teacher</span>
            <ul className="dropdown-menu">
              <li><Link to="/teachers">Teachers</Link></li>
              <li><Link to="/attendance">Attendance</Link></li>
              <li><Link to="/grades">Grades</Link></li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <span>Admin</span>
            <ul className="dropdown-menu">
              <li><Link to="/admin/dashboard">Dashboard</Link></li>
              <li><Link to="/admin/fees">Fee Management</Link></li>
              <li><Link to="/admin/students">Manage Students</Link></li>
              <li><Link to="/admin/teachers">Manage Teachers</Link></li>
              <li><Link to="/admin/schools">Manage Schools</Link></li>
              {/* Add more admin-specific links here as required */}
            </ul>
          </li>
          
          <li className="nav-item dropdown">
            <span>More</span>
            <ul className="dropdown-menu">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/news">News</Link></li>
            </ul>
          </li>
        </ul>
      </div>
      
      {/* Right Side: Login/Signup */}
      {/*<div className="nav-right">*/}
      {/*  <Link to="/login" className="nav-auth">Login</Link>*/}
      {/*  <Link to="/signup" className="nav-auth">Signup</Link>*/}
      {/*</div>*/}
    </nav>
  );
}