import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EMPTY = { classId: "", name: "", capacity: "40" };

export default function SectionFormModal ({ open, onClose, onSubmit, classes, loading }) {
  const [form, setForm] = useState(EMPTY);
  
  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);
  
  if (!open) return null;
  
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      classId: Number(form.classId),
      name: form.name,
      capacity: form.capacity ? Number(form.capacity) : 40,
    });
  };
  
  return (
     <div className="modal-overlay" onClick={onClose}>
       <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
         <div className="modal-header">
           <h3>Add New Section</h3>
           <button className="modal-close" onClick={onClose}><X/></button>
         </div>
         <form onSubmit={handleSubmit}>
           <div className="modal-body">
             <div className="form-group">
               <label className="form-label required">Class</label>
               <select className="form-select" value={form.classId} onChange={set("classId")} required>
                 <option value="">— Select Class —</option>
                 {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </select>
             </div>
             <div className="form-group">
               <label className="form-label required">Section Name</label>
               <input
                  className="form-input"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. A, B, Rose, Blue"
                  required
               />
             </div>
             <div className="form-group">
               <label className="form-label">Capacity</label>
               <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={set("capacity")}
                  placeholder="40"
               />
             </div>
           </div>
           <div className="modal-footer">
             <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
             <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading ? "Saving…" : "Add Section"}
             </button>
           </div>
         </form>
       </div>
     </div>
  );
}