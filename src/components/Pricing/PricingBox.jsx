import "./PricingBox.css"

const PricingBox = ({ price, duration, packageName, subtitle, children }) => {
  return (
     <div className="pricing-wrapper">
       <div className="pricing-box">
         <div className="pricing-header">
           <h3 className="price">
             $<span className="amount">{price}</span>
             <span className="time">/{duration}</span>
           </h3>
           
           <h4 className="package-name">{packageName}</h4>
         </div>
         
         <p className="subtitle">{subtitle}</p>
         
         <div className="pricing-action">
           <button className="trial-btn">Start Free Trial</button>
         </div>
         
         <div className="pricing-features">{children}</div>
         
         <div className="pricing-bg">
           <svg
              width="179"
              height="158"
              viewBox="0 0 179 158"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
           >
             <path
                opacity="0.5"
                d="M75.0002 63.256C115.229 82.3657 136.011 137.496 141.374 162.673C150.063 203.47 207.217 197.755
                202.419 167.738C195.393 123.781 137.273 90.3579 75.0002 63.256Z"
                fill="url(#paint0_linear)"
             />
             <path
                opacity="0.3"
                d="M178.255 0.150879C129.388 56.5969 134.648 155.224 143.387 197.482C157.547 265.958 65.9705
                295.709 53.1024 246.401C34.2588 174.197 100.939 83.7223 178.255 0.150879Z"
                fill="url(#paint1_linear)"
             />
             <defs>
               <linearGradient
                  id="paint0_linear"
                  x1="69.6694"
                  y1="29.9033"
                  x2="196.108"
                  y2="83.2919"
               >
                 <stop stopColor="#4A6CF7" stopOpacity="0.62"/>
                 <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"/>
               </linearGradient>
               <linearGradient
                  id="paint1_linear"
                  x1="165.348"
                  y1="-75.4466"
                  x2="-3.75136"
                  y2="103.645"
               >
                 <stop stopColor="#4A6CF7" stopOpacity="0.62"/>
                 <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"/>
               </linearGradient>
             </defs>
           </svg>
         </div>
       </div>
     </div>
  )
}

export default PricingBox