import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, BookOpen, Layers } from "lucide-react";
import { classApi } from "@/services/classApi";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import ClassFormModal from "./ClassFormModal";
import SectionFormModal from "./SectionFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer from "@/components/ui/ToastContainer";

export default function ClassesPage () {
  const { user } = useAuthStore();
  const schoolId = user?.schoolId;
  const { toasts, toast } = useToast();
  
  const [tab, setTab] = useState("classes");  // 'classes' | 'sections'
  
  // Classes state
  const [classes, setClasses] = useState([]);
  const [classLoading, setClassLoading] = useState(true);
  const [classFormOpen, setClassFormOpen] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [deleteClass, setDeleteClass] = useState(null);
  const [classSaving, setClassSaving] = useState(false);
  const [classDeleting, setClassDeleting] = useState(false);
  
  // Sections state
  const [sections, setSections] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(true);
  const [sectionFormOpen, setSectionFormOpen] = useState(false);
  const [deleteSection, setDeleteSection] = useState(null);
  const [sectionSaving, setSectionSaving] = useState(false);
  const [sectionDeleting, setSectionDeleting] = useState(false);
  
  // ── Fetch classes ──────────────────────────────────────
  const fetchClasses = useCallback(async () => {
    setClassLoading(true);
    try {
      const res = await classApi.getAll(schoolId);
      setSections(Array.isArray(res.data) ? res.data : res.data.content ?? []);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setClassLoading(false);
    }
  }, [schoolId]);
  
  // ── Fetch sections ─────────────────────────────────────
  const fetchSections = useCallback(async () => {
    setSectionLoading(true);
    try {
      const res = await classApi.getAllSections(schoolId);
      setSections(res.data);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setSectionLoading(false);
    }
  }, [schoolId]);
  
  useEffect(() => { fetchClasses(); }, [fetchClasses]);
  useEffect(() => { fetchSections(); }, [fetchSections]);
  
  // ── Class handlers ─────────────────────────────────────
  const handleAddClass = () => {
    setEditClass(null);
    setClassFormOpen(true);
  };
  const handleEditClass = (c) => {
    setEditClass(c);
    setClassFormOpen(true);
  };
  
  const handleClassSubmit = async (payload) => {
    setClassSaving(true);
    try {
      if (editClass) {
        await classApi.update(schoolId, editClass.id, payload);
        toast({ message: "Class updated successfully" });
      } else {
        await classApi.create(schoolId, payload);
        toast({ message: "Class added successfully" });
      }
      setClassFormOpen(false);
      await fetchClasses();
      await fetchSections(); // refresh sections too since they show class name
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setClassSaving(false);
    }
  };
  
  const handleClassDelete = async () => {
    setClassDeleting(true);
    try {
      await classApi.delete(schoolId, deleteClass.id);
      toast({ message: "Class deleted successfully" });
      setDeleteClass(null);
      await fetchClasses();
      await fetchSections();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setClassDeleting(false);
    }
  };
  
  // ── Section handlers ───────────────────────────────────
  const handleSectionSubmit = async (payload) => {
    setSectionSaving(true);
    try {
      await classApi.createSection(schoolId, payload);
      toast({ message: "Section added successfully" });
      setSectionFormOpen(false);
      await fetchSections();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setSectionSaving(false);
    }
  };
  
  const handleSectionDelete = async () => {
    setSectionDeleting(true);
    try {
      await classApi.deleteSection(schoolId, deleteSection.id);
      toast({ message: "Section deleted successfully" });
      setDeleteSection(null);
      await fetchSections();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setSectionDeleting(false);
    }
  };
  
  return (
     <div>
       {/* Page header */}
       <div className="page-header-row">
         <div>
           <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--gray-900)" }}>
             Classes & Sections
           </h2>
           <p style={{ fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginTop: 4 }}>
             Manage classes, sections, and their assignments.
           </p>
         </div>
         <button
            className="btn btn-primary"
            onClick={tab === "classes" ? handleAddClass : () => setSectionFormOpen(true)}
         >
           <Plus/> {tab === "classes" ? "Add Class" : "Add Section"}
         </button>
       </div>
       
       {/* Tabs */}
       <div className="tabs">
         <button
            className={`tab-btn${tab === "classes" ? " active" : ""}`}
            onClick={() => setTab("classes")}
         >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <BookOpen style={{ width: 15, height: 15 }}/> Classes ({classes.length})
          </span>
         </button>
         <button
            className={`tab-btn${tab === "sections" ? " active" : ""}`}
            onClick={() => setTab("sections")}
         >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Layers style={{ width: 15, height: 15 }}/> Sections ({sections.length})
          </span>
         </button>
       </div>
       
       {/* ── Classes tab ── */}
       {tab === "classes" && (
          <div className="card">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Class Name</th>
                  <th>Grade Level</th>
                  <th>Total Sections</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {classLoading ? (
                   <tr>
                     <td colSpan={5} style={{ textAlign: "center", padding: 40 }}>
                       <div className="spinner" style={{ margin: "0 auto" }}/>
                     </td>
                   </tr>
                ) : classes.length === 0 ? (
                   <tr>
                     <td colSpan={5}>
                       <div className="empty-state">
                         <BookOpen/>
                         <strong>No classes yet</strong>
                         <p>Add your first class to get started.</p>
                       </div>
                     </td>
                   </tr>
                ) : (
                   classes.map((c, i) => {
                     const sectionCount = sections.filter((s) => s.classId === c.id).length;
                     return (
                        <tr key={c.id}>
                          <td style={{ color: "var(--gray-400)", width: 40 }}>{i + 1}</td>
                          <td style={{ fontWeight: 500 }}>{c.name}</td>
                          <td>
                            {c.gradeLevel != null
                               ? <span className="badge badge-primary">Grade {c.gradeLevel}</span>
                               : <span style={{ color: "var(--gray-400)" }}>—</span>}
                          </td>
                          <td>
                            <span className="badge badge-gray">{sectionCount} section{sectionCount !== 1 ? "s"
                               : ""}</span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                              <button className="btn btn-ghost btn-icon"
                                      title="Edit"
                                      onClick={() => handleEditClass(c)}>
                                <Pencil style={{ width: 15, height: 15 }}/>
                              </button>
                              <button
                                 className="btn btn-ghost btn-icon"
                                 title="Delete"
                                 style={{ color: "var(--danger)" }}
                                 onClick={() => setDeleteClass(c)}
                              >
                                <Trash2 style={{ width: 15, height: 15 }}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                     );
                   })
                )}
                </tbody>
              </table>
            </div>
          </div>
       )}
       
       {/* ── Sections tab ── */}
       {tab === "sections" && (
          <div className="card">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Section Name</th>
                  <th>Class</th>
                  <th>Capacity</th>
                  <th>Class Teacher</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sectionLoading ? (
                   <tr>
                     <td colSpan={6} style={{ textAlign: "center", padding: 40 }}>
                       <div className="spinner" style={{ margin: "0 auto" }}/>
                     </td>
                   </tr>
                ) : sections.length === 0 ? (
                   <tr>
                     <td colSpan={6}>
                       <div className="empty-state">
                         <Layers/>
                         <strong>No sections yet</strong>
                         <p>Add sections to your classes to get started.</p>
                       </div>
                     </td>
                   </tr>
                ) : (
                   sections.map((s, i) => (
                      <tr key={s.id}>
                        <td style={{ color: "var(--gray-400)", width: 40 }}>{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{s.name}</td>
                        <td>
                          {s.className
                             ? <span className="badge badge-primary">{s.className}</span>
                             : <span style={{ color: "var(--gray-400)" }}>—</span>}
                        </td>
                        <td>{s.capacity ?? "—"}</td>
                        <td>
                          {s.teacherName
                             ? s.teacherName
                             : <span style={{ color: "var(--gray-400)" }}>Not assigned</span>}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                            <button
                               className="btn btn-ghost btn-icon"
                               title="Delete"
                               style={{ color: "var(--danger)" }}
                               onClick={() => setDeleteSection(s)}
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
       )}
       
       {/* Modals */}
       <ClassFormModal
          open={classFormOpen}
          onClose={() => setClassFormOpen(false)}
          onSubmit={handleClassSubmit}
          initial={editClass}
          loading={classSaving}
       />
       
       <SectionFormModal
          open={sectionFormOpen}
          onClose={() => setSectionFormOpen(false)}
          onSubmit={handleSectionSubmit}
          classes={classes}
          loading={sectionSaving}
       />
       
       <ConfirmDialog
          open={!!deleteClass}
          onClose={() => setDeleteClass(null)}
          onConfirm={handleClassDelete}
          loading={classDeleting}
          title="Delete Class"
          message={"Are you sure you want to delete \"" + (deleteClass?.name ?? "") + "\"? All sections under this class will also be affected."}
       />
       
       <ConfirmDialog
          open={!!deleteSection}
          onClose={() => setDeleteSection(null)}
          onConfirm={handleSectionDelete}
          loading={sectionDeleting}
          title="Delete Section"
          message={"Are you sure you want to delete section \"" + (deleteSection?.name ?? "") + "\"?"}
       />
       
       <ToastContainer toasts={toasts}/>
     </div>
  );
}