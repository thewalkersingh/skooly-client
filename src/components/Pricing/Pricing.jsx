import React, { useState } from "react"
import "./Pricing.css"
import SectionTitle from "../Common/SectionTitle.jsx"
import OfferList from "./OfferList"
import PricingBox from "./PricingBox"

const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true)
  
  return (
     <section id="pricing" className="pricing-section">
       <div className="pricing-container">
         <SectionTitle
            title="Simple and Affordable Pricing"
            paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
            center
            width="665px"
         />
         
         {/* Toggle */}
         <div className="pricing-toggle-wrapper">
          <span
             onClick={() => setIsMonthly(true)}
             className={`pricing-toggle-option ${
                isMonthly ? "active" : ""
             }`}
          >
            Monthly
          </span>
           <div
              onClick={() => setIsMonthly(!isMonthly)}
              className="pricing-toggle-switch"
           >
             <div className="pricing-switch-track"></div>
             <div
                className={`pricing-switch-thumb ${
                   isMonthly ? "" : "moved"
                }`}
             >
               <span className="pricing-switch-dot"></span>
             </div>
           </div>
           <span
              onClick={() => setIsMonthly(false)}
              className={`pricing-toggle-option ${
                 !isMonthly ? "active" : ""
              }`}
           >
            Yearly
          </span>
         </div>
         
         {/* Pricing Boxes */}
         <div className="pricing-grid">
           <PricingBox
              packageName="Lite"
              price={isMonthly ? "40" : "120"}
              duration={isMonthly ? "mo" : "yr"}
              subtitle="Lorem ipsum dolor sit amet adiscing elit Mauris egestas enim."
           >
             <OfferList text="All UI Components" status="active"/>
             <OfferList text="Use with Unlimited Projects" status="active"/>
             <OfferList text="Commercial Use" status="active"/>
             <OfferList text="Email Support" status="active"/>
             <OfferList text="Lifetime Access" status="inactive"/>
             <OfferList text="Free Lifetime Updates" status="inactive"/>
           </PricingBox>
           
           <PricingBox
              packageName="Basic"
              price={isMonthly ? "399" : "789"}
              duration={isMonthly ? "mo" : "yr"}
              subtitle="Lorem ipsum dolor sit amet adiscing elit Mauris egestas enim."
           >
             <OfferList text="All UI Components" status="active"/>
             <OfferList text="Use with Unlimited Projects" status="active"/>
             <OfferList text="Commercial Use" status="active"/>
             <OfferList text="Email Support" status="active"/>
             <OfferList text="Lifetime Access" status="active"/>
             <OfferList text="Free Lifetime Updates" status="inactive"/>
           </PricingBox>
           
           <PricingBox
              packageName="Plus"
              price={isMonthly ? "589" : "999"}
              duration={isMonthly ? "mo" : "yr"}
              subtitle="Lorem ipsum dolor sit amet adiscing elit Mauris egestas enim."
           >
             <OfferList text="All UI Components" status="active"/>
             <OfferList text="Use with Unlimited Projects" status="active"/>
             <OfferList text="Commercial Use" status="active"/>
             <OfferList text="Email Support" status="active"/>
             <OfferList text="Lifetime Access" status="active"/>
             <OfferList text="Free Lifetime Updates" status="active"/>
           </PricingBox>
         </div>
       </div>
       
       {/* Decorative background */}
       <div className="pricing-bg"></div>
     </section>
  )
}

export default Pricing