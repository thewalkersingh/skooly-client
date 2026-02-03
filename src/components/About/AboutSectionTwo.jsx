import React from "react"
import "./AboutSectionTwo.css"

const AboutSectionTwo = () => {
  return (
     <section id="about-two" className="about-two-section">
       <div className="about-two-container">
         <div className="about-two-row">
           {/* Left column with image */}
           <div className="about-two-col">
             <div className="about-two-image-wrapper">
               <img
                  src="/images/about/about-image-2.svg"
                  alt="about image"
                  className="about-two-image light-mode"
               />
               <img
                  src="/images/about/about-image-2-dark.svg"
                  alt="about image"
                  className="about-two-image dark-mode"
               />
             </div>
           </div>
           
           {/* Right column with text */}
           <div className="about-two-col">
             <div className="about-two-content">
               <div className="about-two-block">
                 <h3 className="about-two-title">Bug free code</h3>
                 <p className="about-two-paragraph">
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                 </p>
               </div>
               
               <div className="about-two-block">
                 <h3 className="about-two-title">Premier support</h3>
                 <p className="about-two-paragraph">
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                   do eiusmod tempor incididunt.
                 </p>
               </div>
               
               <div className="about-two-block">
                 <h3 className="about-two-title">Next.js</h3>
                 <p className="about-two-paragraph">
                   Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt
                   consectetur adipiscing elit setim.
                 </p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>
  )
}

export default AboutSectionTwo