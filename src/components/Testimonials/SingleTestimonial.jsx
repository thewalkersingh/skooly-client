import React from "react"
import "./SingleTestimonial.css"

const starIcon = (
   <svg width="18" height="16" viewBox="0 0 18 16" className="star-icon">
     <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815
     11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z"/>
   </svg>
)

const SingleTestimonial = ({ testimonial }) => {
  const { star, name, image, content, designation } = testimonial
  
  const ratingIcons = []
  for (let index = 0; index < star; index++) {
    ratingIcons.push(
       <span key={index} className="star-wrapper">
        {starIcon}
      </span>
    )
  }
  
  return (
     <div className="testimonial">
       <div className="testimonial-box">
         <div className="testimonial-rating">{ratingIcons}</div>
         <p className="testimonial-content">“{content}”</p>
         <div className="testimonial-author">
           <div className="author-avatar">
             <img src={image} alt={name}/>
           </div>
           <div className="author-info">
             <h3 className="author-name">{name}</h3>
             <p className="author-role">{designation}</p>
           </div>
         </div>
       </div>
     </div>
  )
}

export default SingleTestimonial