import { Construction } from "lucide-react";

export default function ModulePlaceholder ({ title, description }) {
  return (
     <div className="module-placeholder">
       <Construction/>
       <h3>{title}</h3>
       <p>{description ?? "This module will be built in the next phase."}</p>
     </div>
  );
}