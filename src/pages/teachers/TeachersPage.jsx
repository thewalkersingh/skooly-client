import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import { teacherApi } from "@/services/teacherApi";
import { classApi } from "@/services/classApi";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import TeacherFormModal from "./TeacherFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer from "@/components/ui/ToastContainer";
import "./teachers.css";

const STATUS_BADGE = {
  ACTIVE: "badge badge-success",
  INACTIVE: "badge badge-gray",
};

function getInitials (firstName, lastName) {
  return ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase();
}

export default function TeachersPage () {
  const { user } = useAuthStore();
  const schoolId = user?.schoolId;
  const { toasts, toast } = useToast();
  
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  
  // fetch subjects for dropdown
  useEffect(() => {
    classApi.getAllSubjects(schoolId)
       .then((res) => setSubjects(res.data))
       .catch((err) => toast({ message: "Failed to load subjects: " + err.message, type: "error" }));
  }, [schoolId]);
  
  // fetch teachers
  const fetchTeachers = useCallback(async (q) => {
    setLoading(true);
    try {
      const res = await teacherApi.getAll(schoolId, q);
      setTeachers(res.data);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [schoolId]);
  
  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);
  
  useEffect(() => {
    const t = setTimeout(() => fetchTeachers(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchTeachers]);
  
  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const handleEdit = (t) => {
    setEditTarget(t);
    setFormOpen(true);
  };
  
  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editTarget) {
        await teacherApi.update(schoolId, editTarget.id, payload);
        toast({ message: "Teacher updated successfully" });
      } else {
        await teacherApi.create(schoolId, payload);
        toast({ message: "Teacher added successfully" });
      }
      setFormOpen(false);
      fetchTeachers(search);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await teacherApi.delete(schoolId, deleteTarget.id);
      toast({ message: "Teacher deleted successfully" });
      setDeleteTarget(null);
      fetchTeachers(search);
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
           <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--gray-900)" }}>Teachers</h2>
           <p style={{ fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginTop: 4 }}>
             Manage teacher profiles, subjects, and assignments.
           </p>
         </div>
         <button className="btn btn-primary" onClick={handleAdd}>
           <Plus/> Add Teacher
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
          {teachers.length} teacher{teachers.length !== 1 ? "s" : ""}
        </span>
       </div>
       
       <div className="card">
         <div className="table-wrapper">
           <table className="table">
             <thead>
             <tr>
               <th>Teacher</th>
               <th>Gender</th>
               <th>Subject</th>
               <th>Phone</th>
               <th>Joining Date</th>
               <th>Experience</th>
               <th>Status</th>
               <th style={{ textAlign: "right" }}>Actions</th>
             </tr>
             </thead>
             <tbody>
             {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 40 }}>
                    <div className="spinner" style={{ margin: "0 auto" }}/>
                  </td>
                </tr>
             ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <Users/>
                      <strong>No teachers found</strong>
                      <p>{search ? "Try a different search term." : "Add your first teacher to get started."}</p>
                    </div>
                  </td>
                </tr>
             ) : (
                teachers.map((t) => (
                   <tr key={t.id}>
                     <td>
                       <div className="teacher-name-cell">
                         <div className="teacher-avatar">{getInitials(t.firstName, t.lastName)}</div>
                         <div>
                           <div className="name">{t.fullName}</div>
                           <div className="username">@{t.username}</div>
                         </div>
                       </div>
                     </td>
                     <td>{t.gender ?? "—"}</td>
                     <td>{t.subjectName ?? <span style={{ color: "var(--gray-400)" }}>—</span>}</td>
                     <td>{t.phone ?? "—"}</td>
                     <td>{t.joiningDate ?? "—"}</td>
                     <td>{t.experience != null ? t.experience + " yr" + (t.experience !== 1 ? "s" : "") : "—"}</td>
                     <td>
                      <span className={STATUS_BADGE[t.status] || "badge badge-gray"}>
                        {t.status}
                      </span>
                     </td>
                     <td>
                       <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                         <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => handleEdit(t)}>
                           <Pencil style={{ width: 15, height: 15 }}/>
                         </button>
                         <button
                            className="btn btn-ghost btn-icon"
                            title="Delete"
                            style={{ color: "var(--danger)" }}
                            onClick={() => setDeleteTarget(t)}
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
       
       <TeacherFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
          initial={editTarget}
          subjects={subjects}
          loading={saving}
       />
       
       <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Delete Teacher"
          message={"Are you sure you want to delete " + (deleteTarget?.fullName ?? "this teacher") + "? This action cannot be undone."}
       />
       
       <ToastContainer toasts={toasts}/>
     </div>
  );
}