import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  Save, Loader2, Check, X,
  Clock, Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/layout/PageHeader";
import { attendanceApi } from "@/api/attendanceApi";
import { studentApi } from "@/api/studentApi";
import { classApi } from "@/api/classApi";
import { getInitials, getFullName } from "@/utils/formatters";

const STATUS_OPTIONS = [
  {
    value: "PRESENT",
    label: "Present",
    icon: Check,
    color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
  },
  { value: "ABSENT", label: "Absent", icon: X, color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200" },
  {
    value: "LATE",
    label: "Late",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
  },
  {
    value: "HALF_DAY",
    label: "Half Day",
    icon: Minus,
    color: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
  },
];

export default function MarkAttendancePage () {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state ?? {};
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState(state.classId ?? "");
  const [sectionId, setSectionId] = useState(state.sectionId ?? "");
  const [date, setDate] = useState(
     state.date ?? new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Load classes
  useEffect(() => {
    classApi.getAll({ page: 1, size: 100 })
       .then((res) => setClasses(res.data?.data ?? []))
       .catch(() => {});
  }, []);
  
  // Load sections when class changes
  useEffect(() => {
    if (!classId) {
      setSections([]);
      setSectionId("");
      setStudents([]);
      return;
    }
    classApi.getSections(classId)
       .then((res) => setSections(res.data ?? []))
       .catch(() => {});
  }, [classId]);
  
  // Load students when class/section changes
  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    studentApi.getAll({
      classId,
      sectionId: sectionId || undefined,
      status: "ACTIVE",
      page: 1, size: 200,
    }).then((res) => {
      const list = res.data?.data ?? [];
      setStudents(list);
      // Default all to PRESENT
      const defaults = {};
      list.forEach((s) => {
        defaults[s.id] = { status: "PRESENT", remarks: "" };
      });
      setAttendance(defaults);
    }).catch(() => toast.error("Failed to load students"))
       .finally(() => setLoading(false));
  }, [classId, sectionId]);
  
  const setStatus = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };
  
  const setRemarks = (studentId, remarks) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks },
    }));
  };
  
  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = { status, remarks: "" };
    });
    setAttendance(updated);
  };
  
  const handleSave = async () => {
    if (!classId || !date) {
      toast.error("Please select a class and date");
      return;
    }
    if (students.length === 0) {
      toast.error("No students to mark attendance for");
      return;
    }
    setSaving(true);
    try {
      const entries = students.map((s) => ({
        studentId: s.id,
        status: attendance[s.id]?.status ?? "PRESENT",
        remarks: attendance[s.id]?.remarks ?? "",
      }));
      await attendanceApi.markBulkAttendance({
        classId: Number(classId),
        sectionId: sectionId ? Number(sectionId) : undefined,
        date,
        entries,
      });
      toast.success("Attendance marked successfully!");
      navigate("/attendance");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to mark attendance");
    } finally {
      setSaving(false);
    }
  };
  
  // Summary counts
  const counts = Object.values(attendance).reduce((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {});
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Mark Attendance"
          backTo="/attendance"
          breadcrumbs={[
            { label: "Attendance", path: "/attendance" },
            { label: "Mark Attendance" },
          ]}
       />
       
       {/* Config Row */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <div className="space-y-1 flex-1 min-w-[160px]">
               <Label className="text-xs">Class *</Label>
               <Select value={classId} onValueChange={(v) => {
                 setClassId(v);
                 setSectionId("");
               }}>
                 <SelectTrigger><SelectValue placeholder="Select class"/></SelectTrigger>
                 <SelectContent>
                   {classes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             
             <div className="space-y-1 min-w-[140px]">
               <Label className="text-xs">Section</Label>
               <Select value={sectionId} onValueChange={setSectionId}
                       disabled={!classId}>
                 <SelectTrigger><SelectValue placeholder="All"/></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="">All Sections</SelectItem>
                   {sections.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             
             <div className="space-y-1 min-w-[160px]">
               <Label className="text-xs">Date *</Label>
               <Input type="date" value={date}
                      onChange={(e) => setDate(e.target.value)}/>
             </div>
           </div>
         </CardContent>
       </Card>
       
       {classId && students.length > 0 && (
          <>
            {/* Summary + Quick mark */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Counts */}
              <div className="flex flex-wrap gap-3">
                {STATUS_OPTIONS.map(({ value, label, color }) => (
                   <span key={value}
                         className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${color}`}>
                  {label}: {counts[value] ?? 0}
                </span>
                ))}
              </div>
              {/* Quick mark all */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mark all:</span>
                {STATUS_OPTIONS.map(({ value, label }) => (
                   <Button key={value} variant="outline" size="sm"
                           onClick={() => markAll(value)}>
                     {label}
                   </Button>
                ))}
              </div>
            </div>
            
            {/* Student List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {students.length} Students
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                   <div className="space-y-3 py-2">
                     {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="w-10 h-10 rounded-full"/>
                          <Skeleton className="h-4 flex-1"/>
                          <Skeleton className="h-9 w-64"/>
                        </div>
                     ))}
                   </div>
                ) : (
                   students.map((student, idx) => (
                      <StudentAttendanceRow
                         key={student.id}
                         student={student}
                         index={idx + 1}
                         status={attendance[student.id]?.status ?? "PRESENT"}
                         remarks={attendance[student.id]?.remarks ?? ""}
                         onStatusChange={(s) => setStatus(student.id, s)}
                         onRemarksChange={(r) => setRemarks(student.id, r)}
                      />
                   ))
                )}
              </CardContent>
            </Card>
            
            {/* Save */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate("/attendance")}>
                Cancel
              </Button>
              <Button onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={saving}>
                {saving
                   ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Saving...</>
                   : <><Save className="w-4 h-4 mr-2"/> Save Attendance</>
                }
              </Button>
            </div>
          </>
       )}
       
       {classId && !loading && students.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">
                No active students found for this class.
              </p>
            </CardContent>
          </Card>
       )}
     </div>
  );
}

// ── Student Attendance Row ────────────────────────────────────────────────────
function StudentAttendanceRow ({
  student, index, status, remarks,
  onStatusChange, onRemarksChange,
}) {
  return (
     <div className="flex items-start gap-4 py-3">
       {/* Index + Avatar */}
       <div className="flex items-center gap-3 min-w-0 flex-1">
         <span className="text-xs text-muted-foreground w-6 shrink-0">{index}</span>
         <Avatar className="w-9 h-9 shrink-0">
           <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
             {getInitials(student.firstName, student.lastName)}
           </AvatarFallback>
         </Avatar>
         <div className="min-w-0">
           <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
             {getFullName(student.firstName, student.lastName)}
           </p>
           <p className="text-xs text-muted-foreground">
             Roll: {student.rollNumber ?? "—"}
           </p>
         </div>
       </div>
       
       {/* Status buttons */}
       <div className="flex items-center gap-1.5 shrink-0">
         {STATUS_OPTIONS.map(({ value, label, color }) => (
            <button
               key={value}
               onClick={() => onStatusChange(value)}
               className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  status === value
                     ? color
                     : "bg-white dark:bg-gray-800 text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-gray-300"
               }`}
            >
              {label}
            </button>
         ))}
       </div>
       
       {/* Remarks */}
       <Input
          placeholder="Remarks (optional)"
          value={remarks}
          onChange={(e) => onRemarksChange(e.target.value)}
          className="w-40 h-8 text-xs shrink-0"
       />
     </div>
  );
}