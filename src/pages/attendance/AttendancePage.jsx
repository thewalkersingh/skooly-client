import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ClipboardCheck, Plus, TrendingDown,
  Users, Calendar, BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { attendanceApi } from "@/api/attendanceApi";
import { classApi } from "@/api/classApi";
import { usePagination } from "@/hooks/usePagination";
import { formatDate } from "@/utils/formatters";
import { MONTHS } from "@/utils/constants";
import useAuthStore from "@/store/authStore";

export default function AttendancePage () {
  const navigate = useNavigate();
  const { isAdmin, isTeacher } = useAuthStore();
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  
  // Filters
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [date, setDate] = useState(
     new Date().toISOString().split("T")[0]
  );
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [threshold, setThreshold] = useState(75);
  
  // Data
  const [dayRecords, setDayRecords] = useState([]);
  const [lowAttendance, setLowAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lowLoading, setLowLoading] = useState(false);
  
  const { page, size, setPage } = usePagination();
  
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
      return;
    }
    classApi.getSections(classId)
       .then((res) => setSections(res.data ?? []))
       .catch(() => {});
  }, [classId]);
  
  // Fetch day attendance
  const fetchDayAttendance = useCallback(async () => {
    if (!classId || !date) return;
    setLoading(true);
    try {
      const res = await attendanceApi.getClassAttendance({
        classId,
        sectionId: sectionId || undefined,
        date,
        page, size,
      });
      setDayRecords(res.data?.data ?? []);
    } catch {
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  }, [classId, sectionId, date, page, size]);
  
  // Fetch low attendance
  const fetchLowAttendance = useCallback(async () => {
    if (!classId) return;
    setLowLoading(true);
    try {
      const res = await attendanceApi.getLowAttendance({
        classId,
        threshold,
        month, year,
      });
      setLowAttendance(res.data ?? []);
    } catch {
      toast.error("Failed to fetch low attendance");
    } finally {
      setLowLoading(false);
    }
  }, [classId, threshold, month, year]);
  
  useEffect(() => { fetchDayAttendance(); }, [fetchDayAttendance]);
  useEffect(() => { fetchLowAttendance(); }, [fetchLowAttendance]);
  
  const canMark = isAdmin || isTeacher;
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Attendance"
          subtitle="Track and manage student attendance"
          actions={
             canMark && classId && (
                <Button
                   onClick={() => navigate("/attendance/mark", {
                     state: { classId, sectionId, date }
                   })}
                   className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2"/> Mark Attendance
                </Button>
             )
          }
       />
       
       {/* Filters */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <div className="space-y-1 min-w-[160px] flex-1">
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
                 <SelectTrigger><SelectValue placeholder="All sections"/></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="">All Sections</SelectItem>
                   {sections.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             
             <div className="space-y-1 min-w-[160px]">
               <Label className="text-xs">Date</Label>
               <Input type="date" value={date}
                      onChange={(e) => setDate(e.target.value)}/>
             </div>
           </div>
         </CardContent>
       </Card>
       
       {/* Tabs */}
       <Tabs defaultValue="daily">
         <TabsList>
           <TabsTrigger value="daily">
             <Calendar className="w-4 h-4 mr-1.5"/> Daily
           </TabsTrigger>
           <TabsTrigger value="low">
             <TrendingDown className="w-4 h-4 mr-1.5"/> Low Attendance
           </TabsTrigger>
         </TabsList>
         
         {/* Daily attendance */}
         <TabsContent value="daily">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-base">
                 Attendance — {date ? formatDate(date) : "Select a date"}
               </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               {!classId ? (
                  <EmptyState
                     icon={ClipboardCheck}
                     title="Select a class"
                     description="Choose a class to view its attendance."
                     className="py-12"
                  />
               ) : loading ? (
                  <TableSkeleton/>
               ) : dayRecords.length === 0 ? (
                  <EmptyState
                     icon={ClipboardCheck}
                     title="No attendance records"
                     description="No attendance has been marked for this class on this date."
                     action={
                        canMark && (
                           <Button
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => navigate("/attendance/mark", {
                                state: { classId, sectionId, date }
                              })}
                           >
                             <Plus className="w-4 h-4 mr-2"/> Mark Now
                           </Button>
                        )
                     }
                     className="py-12"
                  />
               ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                        <th className="text-left px-4 py-3 font-medium">Student</th>
                        <th className="text-left px-4 py-3 font-medium">Class</th>
                        <th className="text-left px-4 py-3 font-medium">Section</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                        <th className="text-left px-4 py-3 font-medium">Remarks</th>
                        <th className="text-left px-4 py-3 font-medium">Marked By</th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {dayRecords.map((record) => (
                         <tr key={record.id}
                             className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                           <td className="px-4 py-3 font-medium">
                             {record.studentName}
                           </td>
                           <td className="px-4 py-3 text-muted-foreground">
                             {record.className}
                           </td>
                           <td className="px-4 py-3 text-muted-foreground">
                             {record.sectionName}
                           </td>
                           <td className="px-4 py-3">
                             <StatusBadge status={record.status}/>
                           </td>
                           <td className="px-4 py-3 text-muted-foreground">
                             {record.remarks ?? "—"}
                           </td>
                           <td className="px-4 py-3 text-muted-foreground">
                             {record.markedBy ?? "—"}
                           </td>
                         </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
               )}
             </CardContent>
           </Card>
         </TabsContent>
         
         {/* Low Attendance */}
         <TabsContent value="low">
           <Card>
             <CardHeader className="pb-2">
               <div className="flex items-center justify-between">
                 <CardTitle className="text-base">Low Attendance Students</CardTitle>
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2">
                     <Label className="text-xs whitespace-nowrap">Month</Label>
                     <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                       <SelectTrigger className="w-32">
                         <SelectValue/>
                       </SelectTrigger>
                       <SelectContent>
                         {MONTHS.map((m) => (
                            <SelectItem key={m.value} value={String(m.value)}>
                              {m.label}
                            </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="flex items-center gap-2">
                     <Label className="text-xs">Year</Label>
                     <Input
                        type="number" value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-24"
                     />
                   </div>
                   <div className="flex items-center gap-2">
                     <Label className="text-xs whitespace-nowrap">Below %</Label>
                     <Input
                        type="number" value={threshold} min="0" max="100"
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        className="w-20"
                     />
                   </div>
                 </div>
               </div>
             </CardHeader>
             <CardContent className="p-0">
               {!classId ? (
                  <EmptyState
                     icon={TrendingDown}
                     title="Select a class"
                     description="Choose a class to see low attendance."
                     className="py-12"
                  />
               ) : lowLoading ? (
                  <TableSkeleton/>
               ) : lowAttendance.length === 0 ? (
                  <EmptyState
                     icon={TrendingDown}
                     title="No low attendance students 🎉"
                     description={`All students are above ${threshold}% attendance.`}
                     className="py-12"
                  />
               ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                        <th className="text-left px-4 py-3 font-medium">Student</th>
                        <th className="text-left px-4 py-3 font-medium">Class</th>
                        <th className="text-left px-4 py-3 font-medium">Present Days</th>
                        <th className="text-left px-4 py-3 font-medium">Total Days</th>
                        <th className="text-left px-4 py-3 font-medium">Attendance %</th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {lowAttendance.map((s) => (
                         <tr key={s.studentId}
                             className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                           <td className="px-4 py-3 font-medium">{s.studentName}</td>
                           <td className="px-4 py-3 text-muted-foreground">{s.className}</td>
                           <td className="px-4 py-3">{s.presentDays}</td>
                           <td className="px-4 py-3">{s.totalDays}</td>
                           <td className="px-4 py-3">
                             <AttendancePill percentage={s.attendancePercentage}/>
                           </td>
                         </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
               )}
             </CardContent>
           </Card>
         </TabsContent>
       </Tabs>
     </div>
  );
}

function AttendancePill ({ percentage }) {
  const pct = Number(percentage ?? 0).toFixed(1);
  const color = pct >= 75 ? "bg-green-100 text-green-700"
     : pct >= 50 ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";
  return (
     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {pct}%
    </span>
  );
}

function TableSkeleton () {
  return (
     <div className="p-4 space-y-3">
       {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 flex-1"/>
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-6 w-20 rounded-full"/>
            <Skeleton className="h-4 w-24"/>
          </div>
       ))}
     </div>
  );
}