import React from "react"
import { useTheme } from "next-themes"
import "./ThemeToggler.css"

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme()
  
  return (
     <button
        aria-label="theme toggler"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="theme-toggler"
     >
       {/* Light mode icon */}
       <svg
          viewBox="0 0 23 23"
          className="theme-icon light-icon"
          fill="none"
       >
         <path
            d="M9.55078 1.5C5.80078 1.5 1.30078 5.25 1.30078 11.25C1.30078 17.25 5.80078 21.75 11.8008
            21.75C17.8008 21.75 21.5508 17.25 21.5508 13.5C13.3008 18.75 4.30078 9.75 9.55078 1.5Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
       </svg>
       
       {/* Dark mode icon */}
       <svg
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="theme-icon dark-icon"
       >
         {/* Keep your <mask>, <defs>, <linearGradient> here */}
         <mask id="path-1-inside-1_977:1934" fill="white">
           <path d="M12.0508 16.5C10.8573 16.5 9.71271 16.0259 8.8688 15.182C8.02489 14.3381 7.55078 13.1935
           7.55078 12C7.55078 10.8065 8.02489 9.66193 8.8688 8.81802C9.71271 7.97411 10.8573 7.5 12.0508
           7.5C13.2443 7.5 14.3888 7.97411 15.2328 8.81802C16.0767 9.66193 16.5508 10.8065 16.5508 12C16.5508
           13.1935 16.0767 14.3381 15.2328 15.182C14.3888 16.0259 13.2443 16.5 12.0508 16.5Z"/>
         </mask>
         <path
            d="M12.0508 16.5C10.8573 16.5 9.71271 16.0259 8.8688 15.182C8.02489 14.3381 7.55078 13.1935 7.55078
            12C7.55078 10.8065 8.02489 9.66193 8.8688 8.81802C9.71271 7.97411 10.8573 7.5 12.0508 7.5C13.2443 7.5
            14.3888 7.97411 15.2328 8.81802C16.0767 9.66193 16.5508 10.8065 16.5508 12C16.5508 13.1935 16.0767
            14.3381 15.2328 15.182C14.3888 16.0259 13.2443 16.5 12.0508 16.5Z"
            fill="black"
            stroke="white"
            strokeWidth="2"
            mask="url(#path-1-inside-1_977:1934)"
         />
       </svg>
     </button>
  )
}

export default ThemeToggler