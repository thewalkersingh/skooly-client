import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus, Eye, Pencil, Trash2,
  FileText, BarChart2, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import SearchBar from "@/components/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { examApi } from "@/api/examApi";
import { classApi } from "@/api/classApi";
import { subjectApi } from "@/api/subjectApi";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { formatDate } from "@/utils/formatters";
import useAuthStore from "@/store/authStore";

const EXAM_TYPE_COLORS = {
  UNIT_TEST: "bg-blue-100 text-blue-700",
  MID_TERM: "bg-purple-100 text-purple-700",
  FINAL: "bg-red-100 text-red-700",
  PRACTICE: "bg-green-100 text-green-700",
  ASSIGNMENT: "bg-orange-100 text-orange-700",
};

export default function ExamsPage () {
  const navigate = useNavigate();
  const { isAdmin, isTeacher } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [exams, setExams] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editExam, setEditExam] = useState(null);
  
  const debouncedSearch = useDebounce(search, 400);
  const canEdit = isAdmin || isTeacher;
  
  useEffect(() => {
    classApi.getAll({ page: 1, size: 100 })
       .then((res) => setClasses(res.data?.data ?? []));
  }, []);
  
  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await examApi.getAll({
        page, size,
        search: debouncedSearch || undefined,
        classId: classId || undefined,
      });
      setExams(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch exams"); } finally { setLoading(false); }
  }, [page, size, debouncedSearch, classId]);
  
  useEffect(() => { fetchExams(); }, [fetchExams]);
  useEffect(() => { reset(); }, [debouncedSearch, classId]);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await examApi.delete(deleteId);
      toast.success("Exam deleted");
      setDeleteId(null);
      fetchExams();
    } catch { toast.error("Failed to delete exam"); } finally { setDeleting(false); }
  };
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Exams"
          subtitle={`${total} exams total`}
          actions={
             canEdit && (
                <Button onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2"/> Add Exam
                </Button>
             )
          }
       />
       
       {/* Filters */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <SearchBar value={search} onChange={setSearch}
                        placeholder="Search exams..." className="flex-1 min-w-[200px]"/>
             <Select value={classId} onValueChange={setClassId}>
               <SelectTrigger className="w-40">
                 <SelectValue placeholder="All Classes"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Classes</SelectItem>
                 {classes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
             {(search || classId) && (
                <Button variant="outline"
                        onClick={() => {
                          setSearch("");
                          setClassId("");
                        }}>
                  Clear
                </Button>
             )}
           </div>
         </CardContent>
       </Card>
       
       {/* Table */}
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton/> :
              exams.length === 0 ? (
                 <EmptyState icon={FileText} title="No exams found"
                             description="Create your first exam to get started."
                             action={canEdit && (
                                <Button onClick={() => setShowForm(true)}
                                        className="bg-blue-600 hover:bg-blue-700">
                                  <Plus className="w-4 h-4 mr-2"/> Add Exam
                                </Button>
                             )}
                 />
              ) : (
                 <>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-gray-50 dark:bg-gray-800/50">
                       <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                         <th className="text-left px-4 py-3 font-medium">Exam</th>
                         <th className="text-left px-4 py-3 font-medium">Type</th>
                         <th className="text-left px-4 py-3 font-medium">Class</th>
                         <th className="text-left px-4 py-3 font-medium">Subject</th>
                         <th className="text-left px-4 py-3 font-medium">Date</th>
                         <th className="text-left px-4 py-3 font-medium">Total Marks</th>
                         <th className="text-left px-4 py-3 font-medium">Passing</th>
                         <th className="text-right px-4 py-3 font-medium">Actions</th>
                       </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {exams.map((exam) => (
                          <tr key={exam.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-4 py-3 font-medium">{exam.name}</td>
                            <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${EXAM_TYPE_COLORS[exam.examType] ?? "bg-gray-100 text-gray-700"}`}>
                            {exam.examType?.replace(/_/g, " ")}
                          </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{exam.className}</td>
                            <td className="px-4 py-3 text-muted-foreground">{exam.subjectName}</td>
                            <td className="px-4 py-3 text-muted-foreground">{formatDate(exam.examDate)}</td>
                            <td className="px-4 py-3">{exam.totalMarks}</td>
                            <td className="px-4 py-3 text-muted-foreground">{exam.passingMarks}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => navigate(`/exams/${exam.id}`)}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-blue-600">
                                  <Eye className="w-4 h-4"/>
                                </button>
                                <button onClick={() => navigate(`/exams/${exam.id}/results`)}
                                        title="Enter Results"
                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-purple-600">
                                  <BarChart2 className="w-4 h-4"/>
                                </button>
                                {canEdit && (
                                   <>
                                     <button onClick={() => {
                                       setEditExam(exam);
                                       setShowForm(true);
                                     }}
                                             className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                                       <Pencil className="w-4 h-4"/>
                                     </button>
                                     <button onClick={() => setDeleteId(exam.id)}
                                             className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                                       <Trash2 className="w-4 h-4"/>
                                     </button>
                                   </>
                                )}
                              </div>
                            </td>
                          </tr>
                       ))}
                       </tbody>
                     </table>
                   </div>
                   <Pagination page={page} totalPages={totalPages}
                               total={total} size={size} onPageChange={setPage}/>
                 </>
              )}
         </CardContent>
       </Card>
       
       <ExamFormDialog
          open={showForm}
          onOpenChange={(o) => {
            setShowForm(o);
            if (!o) setEditExam(null);
          }}
          editData={editExam}
          classes={classes}
          onSuccess={() => {
            setShowForm(false);
            setEditExam(null);
            fetchExams();
          }}
       />
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Exam"
                      description="Delete this exam and all its results? This cannot be undone."
                      confirmLabel="Delete" isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Exam Form Dialog ──────────────────────────────────────────────────────────
function ExamFormDialog ({ open, onOpenChange, editData, classes, onSuccess }) {
  const [form, setForm] = useState({
    name: "", examType: "", classId: "", subjectId: "",
    examDate: "", totalMarks: "", passingMarks: "", academicYear: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name ?? "",
        examType: editData.examType ?? "",
        classId: String(editData.classId ?? ""),
        subjectId: String(editData.subjectId ?? ""),
        examDate: editData.examDate ?? "",
        totalMarks: String(editData.totalMarks ?? ""),
        passingMarks: String(editData.passingMarks ?? ""),
        academicYear: editData.academicYear ?? "",
      });
    } else {
      setForm({
        name: "", examType: "", classId: "", subjectId: "",
        examDate: "", totalMarks: "", passingMarks: "", academicYear: ""
      });
    }
  }, [editData, open]);
  
  useEffect(() => {
    if (!form.classId) {
      setSubjects([]);
      return;
    }
    subjectApi.getAll({ page: 1, size: 100 })
       .then((res) => setSubjects(res.data?.data ?? []));
  }, [form.classId]);
  
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const handleSave = async () => {
    const { name, examType, classId, subjectId, examDate, totalMarks, passingMarks } = form;
    if (!name || !examType || !classId || !subjectId || !examDate || !totalMarks || !passingMarks) {
      toast.error("Please fill all required fields");
      return;
    }
    if (Number(passingMarks) > Number(totalMarks)) {
      toast.error("Passing marks cannot exceed total marks");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name, examType,
        classId: Number(classId),
        subjectId: Number(subjectId),
        examDate,
        totalMarks: Number(totalMarks),
        passingMarks: Number(passingMarks),
        academicYear: form.academicYear || undefined,
      };
      editData
         ? await examApi.update(editData.id, payload)
         : await examApi.create(payload);
      toast.success(editData ? "Exam updated" : "Exam created");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };
  
  const F = ({ label, children }) => (
     <div className="space-y-1.5">
       <Label className="text-xs">{label}</Label>
       {children}
     </div>
  );
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-lg">
         <DialogHeader>
           <DialogTitle>{editData ? "Edit Exam" : "Add New Exam"}</DialogTitle>
         </DialogHeader>
         <div className="grid grid-cols-2 gap-4 py-2">
           <F label="Exam Name *">
             <Input placeholder="e.g. Mid Term 2024"
                    value={form.name} onChange={(e) => set("name", e.target.value)}/>
           </F>
           <F label="Exam Type *">
             <Select value={form.examType} onValueChange={(v) => set("examType", v)}>
               <SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger>
               <SelectContent>
                 {["UNIT_TEST", "MID_TERM", "FINAL", "PRACTICE", "ASSIGNMENT"].map((t) => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           <F label="Class *">
             <Select value={form.classId} onValueChange={(v) => {
               set("classId", v);
               set("subjectId", "");
             }}>
               <SelectTrigger><SelectValue placeholder="Select class"/></SelectTrigger>
               <SelectContent>
                 {classes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           <F label="Subject *">
             <Select value={form.subjectId} onValueChange={(v) => set("subjectId", v)}
                     disabled={!form.classId}>
               <SelectTrigger><SelectValue placeholder="Select subject"/></SelectTrigger>
               <SelectContent>
                 {subjects.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           <F label="Exam Date *">
             <Input type="date" value={form.examDate}
                    onChange={(e) => set("examDate", e.target.value)}/>
           </F>
           <F label="Academic Year">
             <Input placeholder="2024-2025" value={form.academicYear}
                    onChange={(e) => set("academicYear", e.target.value)}/>
           </F>
           <F label="Total Marks *">
             <Input type="number" min="1" placeholder="100"
                    value={form.totalMarks}
                    onChange={(e) => set("totalMarks", e.target.value)}/>
           </F>
           <F label="Passing Marks *">
             <Input type="number" min="1" placeholder="35"
                    value={form.passingMarks}
                    onChange={(e) => set("passingMarks", e.target.value)}/>
           </F>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={saving}
                   className="bg-blue-600 hover:bg-blue-700">
             {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {editData ? "Update" : "Create"}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}

function TableSkeleton () {
  return (
     <div className="p-4 space-y-3">
       {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 flex-1"/>
            <Skeleton className="h-6 w-20 rounded-full"/>
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-4 w-24"/>
            <Skeleton className="h-4 w-12"/>
            <Skeleton className="h-4 w-12"/>
            <Skeleton className="h-4 w-20"/>
          </div>
       ))}
     </div>
  );
}