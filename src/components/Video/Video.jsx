import "./Video.css"
import { useState } from "react"
import ReactPlayer from "react-player"

const Video = () => {
  const [isOpen, setOpen] = useState(false)
  
  return (
     <section id="video" className="video-section">
       <div className="video-container">
         <div className="section-title">
           <h2>We are ready to help</h2>
           <p>
             There are many variations of passages of Lorem Ipsum available but
             the majority have suffered alteration in some form.
           </p>
         </div>
         
         <div className="video-wrapper">
           <div className="video-box">
             <img
                src="/images/video/video.jpg"
                alt="video preview"
                className="video-image"
             />
             <div className="video-overlay">
               <button
                  aria-label="video play button"
                  onClick={() => setOpen(true)}
                  className="video-play-btn"
               >
                 <svg width="16" height="18" viewBox="0 0 16 18">
                   <path d="M15.5 8.13397C16.1667 8.51888 16.1667 9.48112 15.5 9.86602L2 17.6603C1.33333 18.0452
                   0.499999 17.564 0.499999 16.7942L0.5 1.20577C0.5 0.43597 1.33333 -0.0451549 2 0.339745L15.5
                   8.13397Z"/>
                 </svg>
               </button>
             </div>
           </div>
         </div>
       </div>
       
       <ReactPlayer // or use ReactPlayer.jsx as component
          channel="youtube"
          autoplay
          isOpen={isOpen}
          videoId="any youtube video link"
          onClose={() => setOpen(false)}
       />
       
       <div className="video-background"></div>
     </section>
  )
}

export default Video