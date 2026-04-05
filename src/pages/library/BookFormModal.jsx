import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EMPTY = {
  title: "", author: "", isbn: "", category: "",
  publisher: "", publishedYear: "", totalCopies: "1",
};

export default function BookFormModal ({ open, onClose, onSubmit, initial, loading }) {
  const [form, setForm] = useState(EMPTY);
  const isEdit = !!initial;
  
  useEffect(() => {
    if (open) {
      setForm(initial ? {
        title: initial.title || "",
        author: initial.author || "",
        isbn: initial.isbn || "",
        category: initial.category || "",
        publisher: initial.publisher || "",
        publishedYear: initial.publishedYear || "",
        totalCopies: initial.totalCopies || "1",
      } : EMPTY);
    }
  }, [initial, open]);
  
  if (!open) return null;
  
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      totalCopies: form.totalCopies ? Number(form.totalCopies) : 1,
      publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
    });
  };
  
  return (
     <div className="modal-overlay" onClick={onClose}>
       <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
         <div className="modal-header">
           <h3>{isEdit ? "Edit Book" : "Add New Book"}</h3>
           <button className="modal-close" onClick={onClose}><X/></button>
         </div>
         <form onSubmit={handleSubmit}>
           <div className="modal-body">
             <div className="form-group">
               <label className="form-label required">Title</label>
               <input className="form-input" value={form.title} onChange={set("title")} required/>
             </div>
             <div className="form-grid">
               <div className="form-group">
                 <label className="form-label">Author</label>
                 <input className="form-input" value={form.author} onChange={set("author")}/>
               </div>
               <div className="form-group">
                 <label className="form-label">ISBN</label>
                 <input className="form-input" value={form.isbn} onChange={set("isbn")}/>
               </div>
               <div className="form-group">
                 <label className="form-label">Category</label>
                 <input className="form-input"
                        value={form.category}
                        onChange={set("category")}
                        placeholder="e.g. Science, History"/>
               </div>
               <div className="form-group">
                 <label className="form-label">Publisher</label>
                 <input className="form-input" value={form.publisher} onChange={set("publisher")}/>
               </div>
               <div className="form-group">
                 <label className="form-label">Published Year</label>
                 <input className="form-input"
                        type="number"
                        min="1900"
                        max="2099"
                        value={form.publishedYear}
                        onChange={set("publishedYear")}/>
               </div>
               <div className="form-group">
                 <label className="form-label required">Total Copies</label>
                 <input className="form-input"
                        type="number"
                        min="1"
                        value={form.totalCopies}
                        onChange={set("totalCopies")}
                        required/>
               </div>
             </div>
           </div>
           <div className="modal-footer">
             <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
             <button type="submit" className="btn btn-primary" disabled={loading}>
               {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Book"}
             </button>
           </div>
         </form>
       </div>
     </div>
  );
}