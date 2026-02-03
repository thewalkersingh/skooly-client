import React from "react"
import "./SingleBlog.css"

const SingleBlog = ({ blog }) => {
  const { title, image, paragraph, author, tags, publishDate } = blog
  
  return (
     <div className="single-blog">
       <a href="/blog-details" className="blog-image-link">
         <span className="blog-tag">{tags[0]}</span>
         <img src={image} alt="blog" className="blog-image"/>
       </a>
       
       <div className="blog-content">
         <h3>
           <a href="/blog-details" className="blog-title">
             {title}
           </a>
         </h3>
         
         <p className="blog-paragraph">{paragraph}</p>
         
         <div className="blog-meta">
           <div className="author-info">
             <div className="author-avatar">
               <img src={author.image} alt="author"/>
             </div>
             <div>
               <h4 className="author-name">By {author.name}</h4>
               <p className="author-role">{author.designation}</p>
             </div>
           </div>
           
           <div className="publish-date">
             <h4 className="date-label">Date</h4>
             <p className="date-value">{publishDate}</p>
           </div>
         </div>
       </div>
     </div>
  )
}

export default SingleBlog