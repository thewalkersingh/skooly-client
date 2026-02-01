import React from 'react';
import '../styles/global.css';

function About() {
  return (
    <div className="about" id="about"
         style={{
           textAlign: "center"
         }}>
      <h1>About Us</h1>
      <h3>We are a School Management app.</h3>
      <ul>
        <li>We manage Students</li>
        <li>We manage Teacher</li>
        <li>We also announce about the upcoming events</li>
      </ul>
    </div>
  );
}

export default About;