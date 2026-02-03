import "./SectionTitle.css"

const SectionTitle = ({
  title,
  paragraph,
  width = "570px",
  center = false,
  mb = "100px",
}) => {
  return (
     <div
        className={`section-title ${center ? "center" : ""}`}
        style={{ maxWidth: width, marginBottom: mb }}
     >
       <h2 className="section-title-heading">{title}</h2>
       <p className="section-title-text">{paragraph}</p>
     </div>
  )
}

export default SectionTitle