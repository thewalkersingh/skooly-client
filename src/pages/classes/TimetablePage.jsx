import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { timetableApi } from "@/api/timetableApi";
import { classApi } from "@/api/classApi";
import { teacherApi } from "@/api/teacherApi";
import { subjectApi } from "@/api/subjectApi";
import useAuthStore from "@/store/authStore";
import { DAYS_OF_WEEK } from "@/utils/constants";

const DAY_COLORS = {
  MONDAY: "bg-blue-50   dark:bg-blue-900/20   text-blue-700   dark:text-blue-300",
  TUESDAY: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  WEDNESDAY: "bg-green-50  dark:bg-green-900/20  text-green-700  dark:text-green-300",
  THURSDAY: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
  FRIDAY: "bg-pink-50   dark:bg-pink-900/20   text-pink-700   dark:text-pink-300",
  SATURDAY: "bg-teal-50   dark:bg-teal-900/20   text-teal-700   dark:text-teal-300",
};

export default function TimetablePage () {
  const { isAdmin, isTeacher } = useAuthStore();
  
  const [timetable, setTimetable] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Filters
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  
  // Filter sections when class changes
  useEffect(() => {
    if (!filterClass) {
      setSections([]);
      setFilterSection("");
      return;
    }
    classApi.getSections(filterClass)
       .then((res) => setSections(res.data ?? []))
       .catch(() => {});
  }, [filterClass]);
  
  // Load static data
  useEffect(() => {
    Promise.all([
      classApi.getAll({ page: 1, size: 100 }),
      teacherApi.getAll({ page: 1, size: 100, status: "ACTIVE" }),
      subjectApi.getAll({ page: 1, size: 100 }),
    ]).then(([c, t, s]) => {
      setClasses(c.data?.data ?? []);
      setTeachers(t.data?.data ?? []);
      setSubjects(s.data?.data ?? []);
    }).catch(() => {});
  }, []);
  
  // Fetch timetable when filters change
  useEffect(() => {
    if (!filterClass) {
      setTimetable([]);
      return;
    }
    fetchTimetable();
  }, [filterClass, filterSection]);
  
  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await timetableApi.getByClass(filterClass, filterSection || undefined);
      setTimetable(res.data ?? []);
    } catch {
      toast.error("Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await timetableApi.delete(deleteId);
      toast.success("Timetable entry deleted");
      setDeleteId(null);
      fetchTimetable();
    } catch {
      toast.error("Failed to delete entry");
    } finally {
      setDeleting(false);
    }
  };
  
  // Group entries by day
  const grouped = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = timetable
       .filter((t) => t.dayOfWeek === day)
       .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});
  
  const hasTimetable = timetable.length > 0;
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Timetable"
          subtitle="View and manage class schedules"
          actions={
             (isAdmin || isTeacher) && filterClass && (
                <Button onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2"/> Add Entry
                </Button>
             )
          }
       />
       
       {/* Filters */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <div className="space-y-1 flex-1 min-w-[160px]">
               <Label className="text-xs">Class *</Label>
               <Select value={filterClass} onValueChange={(v) => {
                 setFilterClass(v);
                 setFilterSection("");
               }}>
                 <SelectTrigger>
                   <SelectValue placeholder="Select class"/>
                 </SelectTrigger>
                 <SelectContent>
                   {classes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             
             <div className="space-y-1 flex-1 min-w-[160px]">
               <Label className="text-xs">Section</Label>
               <Select value={filterSection} onValueChange={setFilterSection}
                       disabled={!filterClass}>
                 <SelectTrigger>
                   <SelectValue placeholder="All sections"/>
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="">All Sections</SelectItem>
                   {sections.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
           </div>
         </CardContent>
       </Card>
       
       {/* Timetable Grid */}
       {!filterClass ? (
          <EmptyState
             icon={Calendar}
             title="Select a class"
             description="Choose a class above to view its timetable."
          />
       ) : loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
               <Skeleton key={i} className="h-28 w-full rounded-xl"/>
            ))}
          </div>
       ) : !hasTimetable ? (
          <EmptyState
             icon={Calendar}
             title="No timetable entries"
             description="Add timetable entries for this class."
             action={
                (isAdmin || isTeacher) && (
                   <Button onClick={() => setShowForm(true)}
                           className="bg-blue-600 hover:bg-blue-700">
                     <Plus className="w-4 h-4 mr-2"/> Add Entry
                   </Button>
                )
             }
          />
       ) : (
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => {
              const entries = grouped[day];
              if (!entries || entries.length === 0) return null;
              return (
                 <Card key={day}>
                   <CardHeader className="pb-2 pt-4 px-5">
                     <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                       {day}
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="px-5 pb-4">
                     <div className="flex flex-wrap gap-3">
                       {entries.map((entry) => (
                          <TimetableEntry
                             key={entry.id}
                             entry={entry}
                             dayColor={DAY_COLORS[day]}
                             canEdit={isAdmin || isTeacher}
                             onDelete={() => setDeleteId(entry.id)}
                          />
                       ))}
                     </div>
                   </CardContent>
                 </Card>
              );
            })}
          </div>
       )}
       
       {/* Add Entry Dialog */}
       <TimetableFormDialog
          open={showForm}
          onOpenChange={setShowForm}
          classId={filterClass}
          sectionId={filterSection}
          sections={sections}
          teachers={teachers}
          subjects={subjects}
          onSuccess={() => {
            setShowForm(false);
            fetchTimetable();
          }}
       />
       
       <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(o) => !o && setDeleteId(null)}
          title="Delete Entry"
          description="Remove this timetable entry?"
          confirmLabel="Delete"
          isLoading={deleting}
          onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Timetable Entry Card ──────────────────────────────────────────────────────
function TimetableEntry ({ entry, dayColor, canEdit, onDelete }) {
  return (
     <div className={`relative flex flex-col gap-1 px-4 py-3 rounded-xl min-w-[160px] ${dayColor}`}>
       <p className="font-semibold text-sm">{entry.subjectName}</p>
       <p className="text-xs opacity-80">{entry.teacherName}</p>
       <p className="text-xs opacity-70 font-medium">
         {entry.startTime} – {entry.endTime}
       </p>
       {entry.roomName && (
          <Badge variant="outline" className="text-xs w-fit mt-0.5">
            {entry.roomName}
          </Badge>
       )}
       {canEdit && (
          <button
             onClick={onDelete}
             className="absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500"/>
          </button>
       )}
     </div>
  );
}

// ── Timetable Form Dialog ─────────────────────────────────────────────────────
function TimetableFormDialog ({
  open, onOpenChange, classId, sectionId,
  sections, teachers, subjects, onSuccess,
}) {
  const [form, setForm] = useState({
    sectionId: sectionId || "",
    subjectId: "",
    teacherId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
  });
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    setForm((f) => ({ ...f, sectionId: sectionId || "" }));
  }, [sectionId, open]);
  
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  
  const handleSave = async () => {
    const { sectionId, subjectId, teacherId, dayOfWeek, startTime, endTime } = form;
    if (!sectionId || !subjectId || !teacherId || !dayOfWeek || !startTime || !endTime) {
      toast.error("Please fill all required fields");
      return;
    }
    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }
    setSaving(true);
    try {
      await timetableApi.create({
        classId: Number(classId),
        sectionId: Number(sectionId),
        subjectId: Number(subjectId),
        teacherId: Number(teacherId),
        dayOfWeek,
        startTime,
        endTime,
      });
      toast.success("Timetable entry added");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Conflict detected or something went wrong");
    } finally {
      setSaving(false);
    }
  };
  
  const Field = ({ label, children }) => (
     <div className="space-y-1.5">
       <Label className="text-xs">{label}</Label>
       {children}
     </div>
  );
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>Add Timetable Entry</DialogTitle>
         </DialogHeader>
         
         <div className="grid grid-cols-2 gap-4 py-2">
           <Field label="Section *">
             <Select value={form.sectionId} onValueChange={(v) => set("sectionId", v)}>
               <SelectTrigger><SelectValue placeholder="Select section"/></SelectTrigger>
               <SelectContent>
                 {sections.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </Field>
           
           <Field label="Day *">
             <Select value={form.dayOfWeek} onValueChange={(v) => set("dayOfWeek", v)}>
               <SelectTrigger><SelectValue placeholder="Select day"/></SelectTrigger>
               <SelectContent>
                 {DAYS_OF_WEEK.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </Field>
           
           <Field label="Subject *">
             <Select value={form.subjectId} onValueChange={(v) => set("subjectId", v)}>
               <SelectTrigger><SelectValue placeholder="Select subject"/></SelectTrigger>
               <SelectContent>
                 {subjects.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </Field>
           
           <Field label="Teacher *">
             <Select value={form.teacherId} onValueChange={(v) => set("teacherId", v)}>
               <SelectTrigger><SelectValue placeholder="Select teacher"/></SelectTrigger>
               <SelectContent>
                 {teachers.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.firstName} {t.lastName}
                    </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </Field>
           
           <Field label="Start Time *">
             <Input type="time" value={form.startTime}
                    onChange={(e) => set("startTime", e.target.value)}/>
           </Field>
           
           <Field label="End Time *">
             <Input type="time" value={form.endTime}
                    onChange={(e) => set("endTime", e.target.value)}/>
           </Field>
         </div>
         
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button onClick={handleSave}
                   className="bg-blue-600 hover:bg-blue-700"
                   disabled={saving}>
             {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             Add Entry
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}