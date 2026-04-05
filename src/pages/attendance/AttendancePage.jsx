import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, Users, Save } from "lucide-react";
import { attendanceApi } from "@/services/attendanceApi";
import { classApi } from "@/services/classApi";
import { studentApi } from "@/services/studentApi";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";
import "./attendance.css";

const STATUSES = ["PRESENT", "ABSENT", "LATE"];

function getInitials (name) {
  return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??";
}

function todayStr () {
  return new Date().toISOString().split("T")[0];
}

export default function AttendancePage () {
  const { user } = useAuthStore();
  const schoolId = user?.schoolId;
  const { toasts, toast } = useToast();
  
  const [tab, setTab] = useState("mark");   // 'mark' | 'view'
  
  // Mark attendance state
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(todayStr());
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'PRESENT' | 'ABSENT' | 'LATE' }
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  
  // Summary state
  const [summary, setSummary] = useState(null);
  
  // View history state
  const [viewClass, setViewClass] = useState("");
  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate] = useState(todayStr());
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // fetch classes
  useEffect(() => {
    classApi.getAll(schoolId)
       .then((res) => {
         const data = Array.isArray(res.data) ? res.data : res.data.content ?? [];
         setClasses(data);
       })
       .catch(() => {});
  }, [schoolId]);
  
  // fetch today's summary
  useEffect(() => {
    attendanceApi.getSummary(schoolId)
       .then((res) => setSummary(res.data))
       .catch(() => {});
  }, [schoolId]);
  
  // fetch students + existing attendance when class/date changes
  useEffect(() => {
    if (!selectedClass || !date) return;
    
    const load = async () => {
      setLoadingStudents(true);
      setAlreadyMarked(false);
      try {
        // Get students for class
        const stuRes = await studentApi.getAll(schoolId);
        const allStudents = Array.isArray(stuRes.data) ? stuRes.data : stuRes.data.content ?? [];
        const classStudents = allStudents.filter((s) => String(s.classId) === String(selectedClass));
        setStudents(classStudents);
        
        // Get existing attendance for this class+date
        const attRes = await attendanceApi.getByClass(schoolId, selectedClass, date);
        const existing = Array.isArray(attRes.data) ? attRes.data : attRes.data.content ?? [];
        
        if (existing.length > 0) {
          setAlreadyMarked(true);
          const map = {};
          existing.forEach((a) => { map[a.studentId] = a.status; });
          setAttendance(map);
        } else {
          // Default everyone to PRESENT
          const map = {};
          classStudents.forEach((s) => { map[s.id] = "PRESENT"; });
          setAttendance(map);
        }
      } catch (err) {
        toast({ message: err.message, type: "error" });
      } finally {
        setLoadingStudents(false);
      }
    };
    
    load();
  }, [selectedClass, date, schoolId]);
  
  const setStatus = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };
  
  // Mark all
  const markAll = (status) => {
    const map = {};
    students.forEach((s) => { map[s.id] = status; });
    setAttendance(map);
  };
  
  const handleSave = async () => {
    if (!selectedClass || !date || students.length === 0) return;
    setSaving(true);
    try {
      const records = students.map((s) => ({
        studentId: s.id,
        status: attendance[s.id] || "ABSENT",
        remarks: "",
      }));
      await attendanceApi.mark(schoolId, {
        classId: Number(selectedClass),
        date,
        records,
      });
      toast({ message: alreadyMarked ? "Attendance updated successfully" : "Attendance marked successfully" });
      setAlreadyMarked(true);
      // Refresh summary
      attendanceApi.getSummary(schoolId).then((res) => setSummary(res.data)).catch(() => {});
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleViewHistory = async () => {
    if (!viewClass) return;
    setHistoryLoading(true);
    try {
      const res = await attendanceApi.getRange(schoolId, viewClass, fromDate, toDate);
      setHistory(Array.isArray(res.data) ? res.data : res.data.content ?? []);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setHistoryLoading(false);
    }
  };
  
  const presentCount = Object.values(attendance).filter((s) => s === "PRESENT").length;
  const absentCount = Object.values(attendance).filter((s) => s === "ABSENT").length;
  const lateCount = Object.values(attendance).filter((s) => s === "LATE").length;
  
  return (
     <div>
       <div className="page-header">
         <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--gray-900)" }}>Attendance</h2>
         <p style={{ fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginTop: 4 }}>
           Mark and track student attendance by class.
         </p>
       </div>
       
       {/* Today's summary cards */}
       {summary && (
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-card-value">{summary.total}</div>
              <div className="summary-card-label">Marked Today</div>
            </div>
            <div className="summary-card present">
              <div className="summary-card-value">{summary.present}</div>
              <div className="summary-card-label">Present</div>
            </div>
            <div className="summary-card absent">
              <div className="summary-card-value">{summary.absent}</div>
              <div className="summary-card-label">Absent</div>
            </div>
            <div className="summary-card late">
              <div className="summary-card-value">{summary.late}</div>
              <div className="summary-card-label">Late</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-value">{summary.presentPercent}%</div>
              <div className="summary-card-label">Present Rate</div>
            </div>
          </div>
       )}
       
       {/* Tabs */}
       <div className="tabs">
         <button className={`tab-btn${tab === "mark" ? " active" : ""}`} onClick={() => setTab("mark")}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CheckCircle style={{ width: 15, height: 15 }}/> Mark Attendance
          </span>
         </button>
         <button className={`tab-btn${tab === "view" ? " active" : ""}`} onClick={() => setTab("view")}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Users style={{ width: 15, height: 15 }}/> View History
          </span>
         </button>
       </div>
       
       {/* ── Mark Attendance tab ── */}
       {tab === "mark" && (
          <div>
            {/* Filters */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-body" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 180 }}>
                  <label className="form-label required">Class</label>
                  <select
                     className="form-select"
                     value={selectedClass}
                     onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">— Select Class —</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 160 }}>
                  <label className="form-label required">Date</label>
                  <input
                     className="form-input"
                     type="date"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Attendance sheet */}
            {selectedClass && students.length > 0 && (
               <>
                 {/* Mark all bar */}
                 <div style={{
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "space-between",
                   marginBottom: 12,
                   flexWrap: "wrap",
                   gap: 8
                 }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                     <span style={{ fontSize: "var(--font-size-sm)", color: "var(--gray-500)" }}>Mark all:</span>
                     <button className="btn btn-sm btn-secondary"
                             onClick={() => markAll("PRESENT")}
                             style={{ color: "var(--success)" }}>
                       <CheckCircle style={{ width: 13, height: 13 }}/> Present
                     </button>
                     <button className="btn btn-sm btn-secondary"
                             onClick={() => markAll("ABSENT")}
                             style={{ color: "var(--danger)" }}>
                       <XCircle style={{ width: 13, height: 13 }}/> Absent
                     </button>
                     <button className="btn btn-sm btn-secondary"
                             onClick={() => markAll("LATE")}
                             style={{ color: "var(--warning)" }}>
                       <Clock style={{ width: 13, height: 13 }}/> Late
                     </button>
                   </div>
                   <div style={{ display: "flex", gap: 12, fontSize: "var(--font-size-sm)" }}>
                     <span style={{ color: "var(--success)", fontWeight: 600 }}>P: {presentCount}</span>
                     <span style={{ color: "var(--danger)", fontWeight: 600 }}>A: {absentCount}</span>
                     <span style={{ color: "var(--warning)", fontWeight: 600 }}>L: {lateCount}</span>
                   </div>
                 </div>
                 
                 {alreadyMarked && (
                    <div style={{
                      background: "var(--warning-light)", border: "1px solid #fcd34d",
                      borderRadius: "var(--border-radius)", padding: "8px 14px",
                      fontSize: "var(--font-size-sm)", color: "var(--warning)", marginBottom: 12
                    }}>
                      ⚠ Attendance already marked for this date. Saving will update the existing records.
                    </div>
                 )}
                 
                 {loadingStudents ? (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <div className="spinner" style={{ margin: "0 auto" }}/>
                    </div>
                 ) : (
                    <div className="attendance-grid">
                      {students.map((s) => (
                         <div key={s.id} className="attendance-row">
                           <div className="attendance-student-info">
                             <div className="attendance-avatar">{getInitials(s.fullName)}</div>
                             <div>
                               <div className="attendance-name">{s.fullName}</div>
                               <div className="attendance-meta">
                                 {s.className ?? "—"}{s.sectionName ? " · " + s.sectionName : ""}
                               </div>
                             </div>
                           </div>
                           <div className="attendance-status-group">
                             {STATUSES.map((status) => (
                                <button
                                   key={status}
                                   className={`attendance-status-btn${attendance[s.id] === status
                                      ? " selected-" + status : ""}`}
                                   onClick={() => setStatus(s.id, status)}
                                >
                                  {status === "PRESENT" ? "P" : status === "ABSENT" ? "A" : "L"}
                                </button>
                             ))}
                           </div>
                         </div>
                      ))}
                    </div>
                 )}
                 
                 {/* Save button */}
                 <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                   <button className="btn btn-primary" onClick={handleSave} disabled={saving || loadingStudents}>
                     <Save style={{ width: 16, height: 16 }}/>
                     {saving ? "Saving…" : alreadyMarked ? "Update Attendance" : "Save Attendance"}
                   </button>
                 </div>
               </>
            )}
            
            {selectedClass && students.length === 0 && !loadingStudents && (
               <div className="empty-state"
                    style={{
                      background: "var(--white)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--border-radius-lg)"
                    }}>
                 <Users/>
                 <strong>No students in this class</strong>
                 <p>Assign students to this class first.</p>
               </div>
            )}
            
            {!selectedClass && (
               <div className="empty-state"
                    style={{
                      background: "var(--white)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--border-radius-lg)"
                    }}>
                 <CheckCircle/>
                 <strong>Select a class to begin</strong>
                 <p>Choose a class and date above to mark attendance.</p>
               </div>
            )}
          </div>
       )}
       
       {/* ── View History tab ── */}
       {tab === "view" && (
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-body" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div className="form-group" style={{ margin: 0, flex: 1, minWidth: 180 }}>
                  <label className="form-label required">Class</label>
                  <select className="form-select" value={viewClass} onChange={(e) => setViewClass(e.target.value)}>
                    <option value="">— Select Class —</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0, minWidth: 150 }}>
                  <label className="form-label">From</label>
                  <input className="form-input"
                         type="date"
                         value={fromDate}
                         onChange={(e) => setFromDate(e.target.value)}/>
                </div>
                <div className="form-group" style={{ margin: 0, minWidth: 150 }}>
                  <label className="form-label">To</label>
                  <input className="form-input" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}/>
                </div>
                <button className="btn btn-primary" onClick={handleViewHistory} disabled={!viewClass || historyLoading}>
                  {historyLoading ? "Loading…" : "View"}
                </button>
              </div>
            </div>
            
            {history.length > 0 && (
               <div className="card">
                 <div className="table-wrapper">
                   <table className="table">
                     <thead>
                     <tr>
                       <th>Student</th>
                       <th>Date</th>
                       <th>Status</th>
                       <th>Remarks</th>
                     </tr>
                     </thead>
                     <tbody>
                     {history.map((a) => (
                        <tr key={a.id}>
                          <td style={{ fontWeight: 500 }}>{a.studentName}</td>
                          <td>{a.date}</td>
                          <td>
                          <span className={
                            a.status === "PRESENT" ? "badge badge-success" :
                               a.status === "ABSENT" ? "badge badge-danger" :
                                  "badge badge-warning"
                          }>
                            {a.status}
                          </span>
                          </td>
                          <td>{a.remarks ?? <span style={{ color: "var(--gray-400)" }}>—</span>}</td>
                        </tr>
                     ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            )}
            
            {history.length === 0 && !historyLoading && viewClass && (
               <div className="empty-state"
                    style={{
                      background: "var(--white)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--border-radius-lg)"
                    }}>
                 <Users/>
                 <strong>No records found</strong>
                 <p>No attendance records for the selected class and date range.</p>
               </div>
            )}
          </div>
       )}
       
       <ToastContainer toasts={toasts}/>
     </div>
  );
}