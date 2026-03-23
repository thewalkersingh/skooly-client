import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, GraduationCap } from "lucide-react";
import { studentApi } from "@/services/studentApi";
import { classApi } from "@/services/classApi";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import StudentFormModalx from "./StudentFormModalx.jsx";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer from "@/components/ui/ToastContainer";
import "./students.css";

const STATUS_BADGE = {
  ACTIVE: "badge badge-success",
  INACTIVE: "badge badge-gray",
  GRADUATED: "badge badge-info",
  TRANSFERRED: "badge badge-warning",
};

function getInitials (firstName, lastName) {
  return ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase();
}

export default function StudentsPagex () {
  const { user } = useAuthStore();
  const schoolId = user?.schoolId;
  const { toasts, toast } = useToast();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Dropdown data
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [parents, setParents] = useState([]);
  
  // ── fetch dropdown data on mount ───────────────────────
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [classRes, sectionRes] = await Promise.all([
          classApi.getAll(schoolId),
          classApi.getAllSections(schoolId),
        ]);
        setClasses(classRes.data);
        setSections(sectionRes.data);
      } catch (err) {
        toast({ message: "Failed to load classes/sections: " + err.message, type: "error" });
      }
    };
    fetchDropdowns();
  }, [schoolId]);
  
  // ── fetch students ──────────────────────────────────────
  const fetchStudents = useCallback(async (q) => {
    setLoading(true);
    try {
      const res = await studentApi.getAll(schoolId, q);
      setStudents(res.data);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [schoolId]);
  
  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  
  useEffect(() => {
    const t = setTimeout(() => fetchStudents(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchStudents]);
  
  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const handleEdit = (s) => {
    setEditTarget(s);
    setFormOpen(true);
  };
  
  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editTarget) {
        await studentApi.update(schoolId, editTarget.id, payload);
        toast({ message: "Student updated successfully" });
      } else {
        await studentApi.create(schoolId, payload);
        toast({ message: "Student added successfully" });
      }
      setFormOpen(false);
      fetchStudents(search);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentApi.delete(schoolId, deleteTarget.id);
      toast({ message: "Student deleted successfully" });
      setDeleteTarget(null);
      fetchStudents(search);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };
  
  return (
     <div>
       <div className="page-header-row">
         <div>
           <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--gray-900)" }}>Students</h2>
           <p style={{ fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginTop: 4 }}>
             Manage student records, enrollment, and profiles.
           </p>
         </div>
         <button className="btn btn-primary" onClick={handleAdd}>
           <Plus/> Add Student
         </button>
       </div>
       
       <div className="toolbar">
         <div className="search-input-wrapper">
           <Search/>
           <input
              className="search-input"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
           />
         </div>
         <span style={{ fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginLeft: "auto" }}>
          {students.length} student{students.length !== 1 ? "s" : ""}
        </span>
       </div>
       
       <div className="card">
         <div className="table-wrapper">
           <table className="table">
             <thead>
             <tr>
               <th>Student</th>
               <th>Gender</th>
               <th>Class / Section</th>
               <th>Phone</th>
               <th>Admission Date</th>
               <th>Status</th>
               <th style={{ textAlign: "right" }}>Actions</th>
             </tr>
             </thead>
             <tbody>
             {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 40 }}>
                    <div className="spinner" style={{ margin: "0 auto" }}/>
                  </td>
                </tr>
             ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <GraduationCap/>
                      <strong>No students found</strong>
                      <p>{search ? "Try a different search term." : "Add your first student to get started."}</p>
                    </div>
                  </td>
                </tr>
             ) : (
                students.map((s) => (
                   <tr key={s.id}>
                     <td>
                       <div className="student-name-cell">
                         <div className="student-avatar">{getInitials(s.firstName, s.lastName)}</div>
                         <div>
                           <div className="name">{s.fullName}</div>
                           <div className="username">@{s.username}</div>
                         </div>
                       </div>
                     </td>
                     <td>{s.gender ?? "—"}</td>
                     <td>
                       {s.className
                          ? <span>{s.className}{s.sectionName ? " — " + s.sectionName : ""}</span>
                          : <span style={{ color: "var(--gray-400)" }}>—</span>}
                     </td>
                     <td>{s.phone ?? "—"}</td>
                     <td>{s.admissionDate ?? "—"}</td>
                     <td>
                      <span className={STATUS_BADGE[s.status] || "badge badge-gray"}>
                        {s.status}
                      </span>
                     </td>
                     <td>
                       <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                         <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => handleEdit(s)}>
                           <Pencil style={{ width: 15, height: 15 }}/>
                         </button>
                         <button
                            className="btn btn-ghost btn-icon"
                            title="Delete"
                            style={{ color: "var(--danger)" }}
                            onClick={() => setDeleteTarget(s)}
                         >
                           <Trash2 style={{ width: 15, height: 15 }}/>
                         </button>
                       </div>
                     </td>
                   </tr>
                ))
             )}
             </tbody>
           </table>
         </div>
       </div>
       
       <StudentFormModalx
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
          initial={editTarget}
          classes={classes}
          sections={sections}
          parents={parents}
          loading={saving}
       />
       
       <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Delete Student"
          message={"Are you sure you want to delete " + (deleteTarget?.fullName ?? "this student") + "? This action cannot be undone."}
       />
       
       <ToastContainer toasts={toasts}/>
     </div>
  );
}