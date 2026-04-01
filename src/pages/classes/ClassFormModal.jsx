import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EMPTY = { name: "", gradeLevel: "" };

export default function ClassFormModal ({ open, onClose, onSubmit, initial, loading }) {
  const [form, setForm] = useState(EMPTY);
  const isEdit = !!initial;
  
  useEffect(() => {
    if (open) {
      setForm(initial ? {
        name: initial.name || "",
        gradeLevel: initial.gradeLevel || "",
      } : EMPTY);
    }
  }, [initial, open]);
  
  if (!open) return null;
  
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      gradeLevel: form.gradeLevel ? Number(form.gradeLevel) : null,
    });
  };
  
  return (
     <div className="modal-overlay" onClick={onClose}>
       <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
         <div className="modal-header">
           <h3>{isEdit ? "Edit Class" : "Add New Class"}</h3>
           <button className="modal-close" onClick={onClose}><X/></button>
         </div>
         <form onSubmit={handleSubmit}>
           <div className="modal-body">
             <div className="form-group">
               <label className="form-label required">Class Name</label>
               <input
                  className="form-input"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Grade 8, Class X"
                  required
               />
             </div>
             <div className="form-group">
               <label className="form-label">Grade Level</label>
               <input
                  className="form-input"
                  type="number"
                  min="1"
                  max="12"
                  value={form.gradeLevel}
                  onChange={set("gradeLevel")}
                  placeholder="e.g. 8"
               />
             </div>
           </div>
           <div className="modal-footer">
             <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
             <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Class"}
             </button>
           </div>
         </form>
       </div>
     </div>
  );
}