import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EMPTY = { bookId: "", studentId: "", issueDate: "", dueDate: "" };

export default function IssueBookModal ({ open, onClose, onSubmit, books, students, loading }) {
  const [form, setForm] = useState(EMPTY);
  
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split("T")[0];
      const due = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
      setForm({ bookId: "", studentId: "", issueDate: today, dueDate: due });
    }
  }, [open]);
  
  if (!open) return null;
  
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      bookId: Number(form.bookId),
      studentId: Number(form.studentId),
      issueDate: form.issueDate,
      dueDate: form.dueDate,
    });
  };
  
  const availableBooks = books.filter((b) => b.availableCopies > 0);
  
  return (
     <div className="modal-overlay" onClick={onClose}>
       <div className="modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
         <div className="modal-header">
           <h3>Issue Book</h3>
           <button className="modal-close" onClick={onClose}><X/></button>
         </div>
         <form onSubmit={handleSubmit}>
           <div className="modal-body">
             <div className="form-group">
               <label className="form-label required">Book</label>
               <select className="form-select" value={form.bookId} onChange={set("bookId")} required>
                 <option value="">— Select Book —</option>
                 {availableBooks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.availableCopies} available)
                    </option>
                 ))}
               </select>
               {books.length > availableBooks.length && (
                  <p style={{ fontSize: "var(--font-size-xs)", color: "var(--gray-400)", marginTop: 4 }}>
                    {books.length - availableBooks.length} book(s) not shown — no copies available
                  </p>
               )}
             </div>
             <div className="form-group">
               <label className="form-label required">Student</label>
               <select className="form-select" value={form.studentId} onChange={set("studentId")} required>
                 <option value="">— Select Student —</option>
                 {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.fullName}</option>
                 ))}
               </select>
             </div>
             <div className="form-grid">
               <div className="form-group">
                 <label className="form-label required">Issue Date</label>
                 <input className="form-input" type="date"
                        value={form.issueDate} onChange={set("issueDate")} required/>
               </div>
               <div className="form-group">
                 <label className="form-label required">Due Date</label>
                 <input className="form-input" type="date"
                        value={form.dueDate} onChange={set("dueDate")} required/>
               </div>
             </div>
           </div>
           <div className="modal-footer">
             <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
             <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading ? "Issuing…" : "Issue Book"}
             </button>
           </div>
         </form>
       </div>
     </div>
  );
}