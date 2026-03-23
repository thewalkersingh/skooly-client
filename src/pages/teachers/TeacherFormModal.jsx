import { useState, useEffect } from "react";
import { X } from "lucide-react";

const GENDERS = ["MALE", "FEMALE", "OTHER"];
const STATUSES = ["ACTIVE", "INACTIVE"];

const EMPTY = {
  firstName: "", lastName: "", dob: "", gender: "", address: "",
  phone: "", email: "", joiningDate: "", subjectId: "",
  qualification: "", experience: "", photo: "",
  status: "ACTIVE", username: "", password: "",
};

function SectionLabel ({ text }) {
  return (
     <p style={{
       fontSize: "var(--font-size-xs)", fontWeight: 600, color: "var(--gray-500)",
       textTransform: "uppercase", letterSpacing: "0.05em", margin: "16px 0 12px"
     }}>
       {text}
     </p>
  );
}

export default function TeacherFormModal ({ open, onClose, onSubmit, initial, subjects, loading }) {
  const [form, setForm] = useState(EMPTY);
  const isEdit = !!initial;
  
  useEffect(() => {
    if (open) {
      setForm(initial ? {
        firstName: initial.firstName || "",
        lastName: initial.lastName || "",
        dob: initial.dob || "",
        gender: initial.gender || "",
        address: initial.address || "",
        phone: initial.phone || "",
        email: initial.email || "",
        joiningDate: initial.joiningDate || "",
        subjectId: initial.subjectId || "",
        qualification: initial.qualification || "",
        experience: initial.experience || "",
        photo: initial.photo || "",
        status: initial.status || "ACTIVE",
        username: initial.username || "",
        password: "",
      } : EMPTY);
    }
  }, [initial, open]);
  
  if (!open) return null;
  
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    payload.subjectId = payload.subjectId ? Number(payload.subjectId) : null;
    payload.experience = payload.experience ? Number(payload.experience) : null;
    if (isEdit && !payload.password) delete payload.password;
    onSubmit(payload);
  };
  
  return (
     <div className="modal-overlay" onClick={onClose}>
       <div
          className="modal"
          style={{ maxWidth: 640, display: "flex", flexDirection: "column", maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
       >
         <div className="modal-header" style={{ flexShrink: 0 }}>
           <h3>{isEdit ? "Edit Teacher" : "Add New Teacher"}</h3>
           <button className="modal-close" onClick={onClose}><X/></button>
         </div>
         
         <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
           <div className="modal-body" style={{ overflowY: "auto", flex: 1 }}>
             
             <SectionLabel text="Personal Information"/>
             <div className="form-grid">
               <div className="form-group">
                 <label className="form-label required">First Name</label>
                 <input className="form-input" value={form.firstName} onChange={set("firstName")} required/>
               </div>
               <div className="form-group">
                 <label className="form-label required">Last Name</label>
                 <input className="form-input" value={form.lastName} onChange={set("lastName")} required/>
               </div>
               <div className="form-group">
                 <label className="form-label">Date of Birth</label>
                 <input className="form-input" type="date" value={form.dob} onChange={set("dob")}/>
               </div>
               <div className="form-group">
                 <label className="form-label">Gender</label>
                 <select className="form-select" value={form.gender} onChange={set("gender")}>
                   <option value="">— Select —</option>
                   {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                 </select>
               </div>
               <div className="form-group">
                 <label className="form-label">Phone</label>
                 <input className="form-input" value={form.phone} onChange={set("phone")}/>
               </div>
               <div className="form-group">
                 <label className="form-label">Email</label>
                 <input className="form-input" type="email" value={form.email} onChange={set("email")}/>
               </div>
             </div>
             <div className="form-group">
               <label className="form-label">Address</label>
               <textarea className="form-textarea" rows={2} value={form.address} onChange={set("address")}/>
             </div>
             
             <SectionLabel text="Professional Details"/>
             <div className="form-grid">
               <div className="form-group">
                 <label className="form-label">Joining Date</label>
                 <input className="form-input" type="date" value={form.joiningDate} onChange={set("joiningDate")}/>
               </div>
               <div className="form-group">
                 <label className="form-label">Status</label>
                 <select className="form-select" value={form.status} onChange={set("status")}>
                   {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>
               <div className="form-group">
                 <label className="form-label">Subject</label>
                 <select className="form-select" value={form.subjectId} onChange={set("subjectId")}>
                   <option value="">— Select Subject —</option>
                   {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                 </select>
               </div>
               <div className="form-group">
                 <label className="form-label">Experience (years)</label>
                 <input className="form-input"
                        type="number"
                        min="0"
                        value={form.experience}
                        onChange={set("experience")}/>
               </div>
               <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                 <label className="form-label">Qualification</label>
                 <input className="form-input"
                        value={form.qualification}
                        onChange={set("qualification")}
                        placeholder="e.g. B.Ed, M.Sc Mathematics"/>
               </div>
             </div>
             
             <SectionLabel text="Login Account"/>
             <div className="form-grid">
               <div className="form-group">
                 <label className="form-label required">Username</label>
                 <input className="form-input"
                        value={form.username}
                        onChange={set("username")}
                        required
                        disabled={isEdit}/>
               </div>
               <div className="form-group">
                 <label className={isEdit ? "form-label" : "form-label required"}>
                   Password {isEdit &&
                    <span style={{ fontWeight: 400, color: "var(--gray-400)" }}>(leave blank to keep)</span>}
                 </label>
                 <input className="form-input"
                        type="password"
                        value={form.password}
                        onChange={set("password")}
                        required={!isEdit}/>
               </div>
             </div>
           
           </div>
           
           <div className="modal-footer" style={{ flexShrink: 0 }}>
             <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
             <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Teacher"}
             </button>
           </div>
         </form>
       </div>
     </div>
  );
}