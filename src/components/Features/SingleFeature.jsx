const SingleFeature = ({feature}) => {
  const {icon, title, paragraph} = feature;
  return (
     <div className="feature-card">
       <div className="feature-icon">{icon}</div>
       <h3 className="feature-title">{title}</h3>
       <p className="feature-description">{paragraph}</p>
     </div>
  );
};

export default SingleFeature;