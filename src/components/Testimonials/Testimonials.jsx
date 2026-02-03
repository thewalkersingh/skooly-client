import SectionTitle from "../Common/SectionTitle.jsx"
import React from "react"
import "./Testimonials.css"
import SingleTestimonial from "./SingleTestimonial"
import { testimonialData } from "./testimonialData.js"

const Testimonials = () => {
  return (
     <section id="testimonials" className="testimonials-section">
       <div className="testimonials-container">
         <SectionTitle
            title="What Our Users Says"
            paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
            center
         />
         
         <div className="testimonials-grid">
           {testimonialData.map((testimonial) => (
              <SingleTestimonial key={testimonial.id} testimonial={testimonial}/>
           ))}
         </div>
       </div>
       
       {/* Decorative background shapes */}
       <div className="testimonials-bg-top"></div>
       <div className="testimonials-bg-bottom"></div>
     </section>
  )
}

export default Testimonials