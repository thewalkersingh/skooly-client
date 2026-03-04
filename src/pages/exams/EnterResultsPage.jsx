import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/layout/PageHeader";
import { examApi } from "@/api/examApi";
import { studentApi } from "@/api/studentApi";
import { getInitials, getFullName } from "@/utils/formatters";

export default function EnterResultsPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [existing, setExisting] = useState({});
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => { loadData(); }, [id]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const examRes = await examApi.getById(id);
      const e = examRes.data;
      setExam(e);
      
      // Load students for the exam's class
      const stuRes = await studentApi.getAll({
        classId: e.classId, status: "ACTIVE", page: 1, size: 200,
      });
      const stuList = stuRes.data?.data ?? [];
      setStudents(stuList);
      
      // Load existing results
      const resRes = await examApi.getResultsByExam(id, { page: 1, size: 200 });
      const existingMap = {};
      const marksMap = {}
      ;(resRes.data?.data ?? []).forEach((r) => {
        existingMap[r.studentId] = r.id;
        marksMap[r.studentId] = String(r.marksObtained);
      });
      setExisting(existingMap);
      setMarks(marksMap);
    } catch {
      toast.error("Failed to load data");
      navigate("/exams");
    } finally {
      setLoading(false);
    }
  };
  
  const setMark = (studentId, value) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };
  
  const handleSave = async () => {
    if (!exam) return;
    
    // Validate
    const invalid = students.filter((s) => {
      const m = marks[s.id];
      if (m === undefined || m === "") return false; // skip blank
      const n = Number(m);
      return isNaN(n) || n < 0 || n > exam.totalMarks;
    });
    if (invalid.length > 0) {
      toast.error(`Invalid marks for: ${invalid.map((s) => s.firstName).join(", ")}`);
      return;
    }
    
    setSaving(true);
    try {
      const entries = students
         .filter((s) => marks[s.id] !== undefined && marks[s.id] !== "")
         .map((s) => ({
           studentId: s.id,
           examId: Number(id),
           marksObtained: Number(marks[s.id]),
         }));
      
      if (entries.length === 0) {
        toast.error("Please enter at least one mark");
        return;
      }
      
      await examApi.createBulkResults({ examId: Number(id), results: entries });
      toast.success(`Results saved for ${entries.length} students!`);
      navigate(`/exams/${id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to save results");
    } finally {
      setSaving(false);
    }
  };
  
  const fillAll = (value) => {
    const updated = {};
    students.forEach((s) => { updated[s.id] = String(value); });
    setMarks(updated);
  };
  
  const filled = students.filter((s) => marks[s.id] !== undefined && marks[s.id] !== "").length;
  const passing = students.filter((s) => {
    const m = Number(marks[s.id]);
    return !isNaN(m) && m >= (exam?.passingMarks ?? 0);
  }).length;
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Enter Results"
          subtitle={exam ? `${exam.name} — ${exam.className} • ${exam.subjectName}` : ""}
          backTo={`/exams/${id}`}
          breadcrumbs={[
            { label: "Exams", path: "/exams" },
            { label: exam?.name ?? "...", path: `/exams/${id}` },
            { label: "Enter Results" },
          ]}
       />
       
       {exam && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Summary */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Total Marks", value: exam.totalMarks, color: "bg-blue-50 text-blue-700" },
                { label: "Passing", value: exam.passingMarks, color: "bg-green-50 text-green-700" },
                { label: "Filled", value: `${filled}/${students.length}`, color: "bg-purple-50 text-purple-700" },
                { label: "Passing Est.", value: passing, color: "bg-orange-50 text-orange-700" },
              ].map(({ label, value, color }) => (
                 <div key={label}
                      className={`px-4 py-2 rounded-xl text-sm font-medium ${color}`}>
                   {label}: <span className="font-bold">{value}</span>
                 </div>
              ))}
            </div>
            {/* Quick fill */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Quick fill:</span>
              <Button variant="outline" size="sm" onClick={() => fillAll(exam.totalMarks)}>
                Full Marks
              </Button>
              <Button variant="outline" size="sm" onClick={() => fillAll(0)}>
                Zero
              </Button>
            </div>
          </div>
       )}
       
       <Card>
         <CardHeader className="pb-2">
           <CardTitle className="text-base">
             {loading ? "..." : `${students.length} Students`}
           </CardTitle>
         </CardHeader>
         <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
           {loading ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 8 }).map((_, i) => (
                   <div key={i} className="flex items-center gap-4 py-2">
                     <Skeleton className="w-9 h-9 rounded-full"/>
                     <Skeleton className="h-4 flex-1"/>
                     <Skeleton className="h-9 w-28"/>
                     <Skeleton className="h-5 w-20 rounded-full"/>
                   </div>
                ))}
              </div>
           ) : (
              students.map((student, idx) => {
                const m = marks[student.id] ?? "";
                const mNum = Number(m);
                const isPassing = m !== "" && !isNaN(mNum) && mNum >= (exam?.passingMarks ?? 0);
                const isFailing = m !== "" && !isNaN(mNum) && mNum < (exam?.passingMarks ?? 0);
                const isInvalid = m !== "" && (isNaN(mNum) || mNum < 0 || mNum > (exam?.totalMarks ?? 0));
                
                return (
                   <div key={student.id}
                        className="flex items-center gap-4 py-3">
                  <span className="text-xs text-muted-foreground w-6 shrink-0">
                    {idx + 1}
                  </span>
                     <Avatar className="w-9 h-9 shrink-0">
                       <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                         {getInitials(student.firstName, student.lastName)}
                       </AvatarFallback>
                     </Avatar>
                     <div className="flex-1 min-w-0">
                       <p className="font-medium text-sm truncate">
                         {getFullName(student.firstName, student.lastName)}
                       </p>
                       <p className="text-xs text-muted-foreground">
                         Roll: {student.rollNumber ?? "—"}
                       </p>
                     </div>
                     
                     {/* Marks input */}
                     <div className="flex items-center gap-2 shrink-0">
                       <Input
                          type="number"
                          min="0"
                          max={exam?.totalMarks}
                          placeholder="—"
                          value={m}
                          onChange={(e) => setMark(student.id, e.target.value)}
                          className={`w-24 text-center ${
                             isInvalid ? "border-red-500 focus-visible:ring-red-500"
                                : isPassing ? "border-green-400"
                                   : isFailing ? "border-red-400"
                                      : ""
                          }`}
                       />
                       <span className="text-sm text-muted-foreground w-16">
                      / {exam?.totalMarks}
                    </span>
                     </div>
                     
                     {/* Pass/Fail indicator */}
                     <div className="w-14 shrink-0">
                       {m !== "" && !isInvalid && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                             isPassing
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }`}>
                        {isPassing ? "Pass" : "Fail"}
                      </span>
                       )}
                       {isInvalid && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        Invalid
                      </span>
                       )}
                     </div>
                     
                     {/* Already saved indicator */}
                     {existing[student.id] && (
                        <span className="text-xs text-muted-foreground shrink-0">
                      ✓ saved
                    </span>
                     )}
                   </div>
                );
              })
           )}
         </CardContent>
       </Card>
       
       {/* Save */}
       {!loading && students.length > 0 && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(`/exams/${id}`)}>
              Cancel
            </Button>
            <Button onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={saving}>
              {saving
                 ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Saving...</>
                 : <><Save className="w-4 h-4 mr-2"/> Save Results</>
              }
            </Button>
          </div>
       )}
     </div>
  );
}