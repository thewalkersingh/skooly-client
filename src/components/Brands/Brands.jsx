import React from "react"
import "./Brands.css"
import brandsData from "./brandsData"

const Brands = () => {
  return (
     <section id="brands" className="brands-section">
       <div className="brands-container">
         <div className="brands-wrapper">
           {brandsData.map((brand) => (
              <SingleBrand key={brand.id} brand={brand}/>
           ))}
         </div>
       </div>
     </section>
  )
}

export default Brands

const SingleBrand = ({ brand }) => {
  const { href, image, imageLight, name } = brand
  
  return (
     <div className="brand-item">
       <a
          href={href}
          target="_blank"
          rel="nofollow noreferrer"
          className="brand-link"
       >
         {/* Light/Dark mode handling */}
         <img src={image} alt={name} className="brand-img light-mode"/>
         <img src={imageLight} alt={name} className="brand-img dark-mode"/>
       </a>
     </div>
  )
}