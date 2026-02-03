import React, { useEffect, useState } from "react"
import "./ScrollToTop.css"

export default function ScrollToTop () {
  const [isVisible, setIsVisible] = useState(false)
  
  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])
  
  return (
     <div className="scroll-container">
       {isVisible && (
          <div
             onClick={scrollToTop}
             aria-label="scroll to top"
             className="scroll-button"
          >
            <span className="scroll-arrow"></span>
          </div>
       )}
     </div>
  )
}