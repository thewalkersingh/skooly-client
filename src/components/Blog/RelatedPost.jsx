import React from "react";
import "./RelatedPost.css";

const RelatedPost = ({ image, slug, title, date }) => {
  return (
     <div className="related-post">
       <div className="related-post-image">
         <img src={image} alt={title} />
       </div>
       <div className="related-post-content">
         <h5>
           <a href={slug} className="related-post-title">
             {title}
           </a>
         </h5>
         <p className="related-post-date">{date}</p>
       </div>
     </div>
  );
};

export default RelatedPost;