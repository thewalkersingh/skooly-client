import { Link } from "react-router-dom"
import "./Breadcrumb.css"

const Breadcrumb = ({ pageName, description }) => {
  return (
     <section className="breadcrumb-section">
       <div className="container">
         <div className="breadcrumb-row">
           <div className="breadcrumb-left">
             <div className="breadcrumb-content">
               <h1 className="breadcrumb-title">{pageName}</h1>
               <p className="breadcrumb-desc">{description}</p>
             </div>
           </div>
           
           <div className="breadcrumb-right">
             <ul className="breadcrumb-list">
               <li>
                 <Link to="/" className="breadcrumb-link">
                   Home
                 </Link>
                 <span className="breadcrumb-separator"></span>
               </li>
               <li className="breadcrumb-current">{pageName}</li>
             </ul>
           </div>
         </div>
       </div>
       
       {/* Decorative background */}
       <span className="breadcrumb-bg left">
        <svg width="287" height="254" viewBox="0 0 287 254">
          <path
             opacity="0.1"
             d="M286.5 0.5L-14.5 254.5V69.5L286.5 0.5Z"
             fill="url(#grad-left)"
          />
          <defs>
            <linearGradient id="grad-left">
              <stop stopColor="#4A6CF7"/>
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </span>
       
       <span className="breadcrumb-bg right">
        <svg width="628" height="258" viewBox="0 0 628 258">
          <path
             opacity="0.1"
             d="M669.125 257.002L345.875 31.9983L524.571 -15.8832L669.125 257.002Z"
             fill="url(#grad-right-1)"
          />
          <path
             opacity="0.1"
             d="M0.0716 182.78L101.988 -15.0769L142.154 81.4093L0.0716 182.78Z"
             fill="url(#grad-right-2)"
          />
          <defs>
            <linearGradient id="grad-right-1">
              <stop stopColor="#4A6CF7"/>
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="grad-right-2">
              <stop stopColor="#4A6CF7"/>
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </span>
     </section>
  )
}

export default Breadcrumb