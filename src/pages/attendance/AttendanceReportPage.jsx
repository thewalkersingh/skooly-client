import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/PageHeader";
import { attendanceApi } from "@/api/attendanceApi";
import { studentApi } from "@/api/studentApi";
import { classApi } from "@/api/classApi";
import { formatPercentage } from "@/utils/formatters";
import { MONTHS } from "@/utils/constants";

export default function AttendanceReportPage () {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthly, setMonthly] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    classApi.getAll({ page: 1, size: 100 })
       .then((res) => setClasses(res.data?.data ?? []));
  }, []);
  
  useEffect(() => {
    if (!classId) {
      setSections([]);
      return;
    }
    classApi.getSections(classId)
       .then((res) => setSections(res.data ?? []));
  }, [classId]);
  
  useEffect(() => {
    if (!classId) return;
    studentApi.getAll({ classId, sectionId: sectionId || undefined, page: 1, size: 200 })
       .then((res) => setStudents(res.data?.data ?? []));
  }, [classId, sectionId]);
  
  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    Promise.all([
      attendanceApi.getStudentMonthly(studentId, { month, year }),
      attendanceApi.getStudentSummary(studentId, {
        from: `${year}-${String(month).padStart(2, "0")}-01`,
        to: `${year}-${String(month).padStart(2, "0")}-31`,
      }),
    ]).then(([m, s]) => {
      setMonthly(m.data ?? []);
      setSummary(s.data ?? null);
    }).catch(() => toast.error("Failed to load report"))
       .finally(() => setLoading(false));
  }, [studentId, month, year]);
  
  // Chart data
  const chartData = monthly.map((r) => ({
    date: r.date?.slice(-2),
    status: r.status === "PRESENT" ? 1 : 0,
  }));
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Attendance Report"
          subtitle="Monthly attendance breakdown per student"
          backTo="/attendance"
       />
       
       {/* Filters */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <div className="space-y-1 flex-1 min-w-[140px]">
               <Label className="text-xs">Class</Label>
               <Select value={classId} onValueChange={(v) => {
                 setClassId(v);
                 setSectionId("");
                 setStudentId("");
               }}>
                 <SelectTrigger><SelectValue placeholder="Select class"/></SelectTrigger>
                 <SelectContent>
                   {classes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             
             <div className="space-y-1 min-w-[130px]">
               <Label className="text-xs">Section</Label>
               <Select value={sectionId} onValueChange={setSectionId} disabled={!classId}>
                 <SelectTrigger><SelectValue placeholder="All"/></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="">All</SelectItem>
                   {sections.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             
             <div className="space-y-1 flex-1 min-w-[160px]">
               <Label className="text-xs">Student</Label>
               <Select value={studentId} onValueChange={setStudentId} disabled={!classId}>
                 <SelectTrigger><SelectValue placeholder="Select student"/></SelectTrigger>
                 <SelectContent>
                   {students.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.firstName} {s.lastName}
                      </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             
             <div className="space-y-1 min-w-[130px]">
               <Label className="text-xs">Month</Label>
               <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                 <SelectTrigger><SelectValue/></SelectTrigger>
                 <SelectContent>
                   {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             
             <div className="space-y-1 w-24">
               <Label className="text-xs">Year</Label>
               <Input type="number" value={year}
                      onChange={(e) => setYear(Number(e.target.value))}/>
             </div>
           </div>
         </CardContent>
       </Card>
       
       {/* Summary Cards */}
       {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Days", value: summary.totalDays, color: "text-gray-900 dark:text-white" },
              { label: "Present", value: summary.presentDays, color: "text-green-600" },
              { label: "Absent", value: summary.absentDays, color: "text-red-600" },
              { label: "Attendance %", value: formatPercentage(summary.attendancePercentage), color: "text-blue-600" },
            ].map(({ label, value, color }) => (
               <Card key={label}>
                 <CardContent className="p-4 text-center">
                   <p className={`text-2xl font-bold ${color}`}>{value}</p>
                   <p className="text-xs text-muted-foreground mt-1">{label}</p>
                 </CardContent>
               </Card>
            ))}
          </div>
       )}
       
       {/* Chart */}
       {studentId && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Daily Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                 <Skeleton className="h-48 w-full"/>
              ) : chartData.length === 0 ? (
                 <p className="text-center text-muted-foreground py-10 text-sm">
                   No data for this period
                 </p>
              ) : (
                 <ResponsiveContainer width="100%" height={200}>
                   <BarChart data={chartData} barSize={16}
                             margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                     <XAxis dataKey="date" tick={{ fontSize: 11 }}/>
                     <YAxis tick={{ fontSize: 11 }} domain={[0, 1]}
                            tickFormatter={(v) => v === 1 ? "P" : "A"}/>
                     <Tooltip
                        formatter={(v) => [v === 1 ? "Present" : "Absent", "Status"]}
                     />
                     <Bar dataKey="status" name="Status"
                          fill="#3b82f6" radius={[3, 3, 0, 0]}/>
                   </BarChart>
                 </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
       )}
     </div>
  );
}