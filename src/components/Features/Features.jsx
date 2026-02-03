import "./Features.css"
import SingleFeature from "./SingleFeature"
import featuresData from "./FeaturesData"

const Features = () => {
  return (
     <section id="features" className="features">
       <div className="features-container">
         <div className="section-title">
           <h2>Main Features</h2>
           <p>
             There are many variations of passages of Lorem Ipsum available but
             the majority have suffered alteration in some form.
           </p>
         </div>
         
         <div className="features-grid">
           {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature}/>
           ))}
         </div>
       </div>
     </section>
  )
}

export default Features