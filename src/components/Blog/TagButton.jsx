import React from "react"
import "./TagButton.css"

const TagButton = ({ href = "#0", text }) => {
  return (
     <a href={href} className="tag-button">
       {text}
     </a>
  )
}

export default TagButton