import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  BarChart2, FileText, Users,
  TrendingUp, Award, AlertTriangle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import { examApi } from "@/api/examApi";
import { usePagination } from "@/hooks/usePagination";
import { formatDate, formatPercentage } from "@/utils/formatters";
import useAuthStore from "@/store/authStore";

export default function ExamDetailPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isTeacher } = useAuthStore();
  const { page, size, setPage } = usePagination();
  
  const [exam, setExam] = useState(null);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  useEffect(() => {
    fetchExam();
    fetchStats();
  }, [id]);
  
  useEffect(() => { fetchResults(); }, [id, page]);
  
  const fetchExam = async () => {
    try {
      const res = await examApi.getById(id);
      setExam(res.data);
    } catch {
      toast.error("Failed to load exam");
      navigate("/exams");
    }
  };
  
  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await examApi.getResultsByExam(id, { page, size });
      setResults(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to load results"); } finally { setLoading(false); }
  };
  
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await examApi.getExamStatistics(id);
      setStats(res.data);
    } catch {} finally { setStatsLoading(false); }
  };
  
  // Grade distribution chart data
  const gradeData = stats?.gradeDistribution
     ? Object.entries(stats.gradeDistribution).map(([grade, count]) => ({ grade, count }))
     : [];
  
  return (
     <div className="space-y-5">
       <PageHeader
          title={exam?.name ?? "Exam Detail"}
          subtitle={`${exam?.className} • ${exam?.subjectName} • ${formatDate(exam?.examDate)}`}
          backTo="/exams"
          breadcrumbs={[
            { label: "Exams", path: "/exams" },
            { label: exam?.name ?? "..." },
          ]}
          actions={
             (isAdmin || isTeacher) && (
                <Button onClick={() => navigate(`/exams/${id}/results`)}
                        className="bg-blue-600 hover:bg-blue-700">
                  <BarChart2 className="w-4 h-4 mr-2"/> Enter Results
                </Button>
             )
          }
       />
       
       {/* Exam Info Cards */}
       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
         {[
           { label: "Total Marks", value: exam?.totalMarks, color: "text-blue-600" },
           { label: "Passing Marks", value: exam?.passingMarks, color: "text-green-600" },
           { label: "Total Students", value: stats?.totalStudents ?? "—", color: "text-purple-600" },
           { label: "Pass %", value: stats ? formatPercentage(stats.passPercentage) : "—", color: "text-orange-600" },
         ].map(({ label, value, color }) => (
            <Card key={label}>
              <CardContent className="p-4 text-center">
                {!exam ? <Skeleton className="h-8 w-16 mx-auto"/> : (
                   <p className={`text-2xl font-bold ${color}`}>{value ?? "—"}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </CardContent>
            </Card>
         ))}
       </div>
       
       <Tabs defaultValue="results">
         <TabsList>
           <TabsTrigger value="results">Results</TabsTrigger>
           <TabsTrigger value="statistics">Statistics</TabsTrigger>
         </TabsList>
         
         {/* Results Tab */}
         <TabsContent value="results">
           <Card>
             <CardContent className="p-0">
               {loading ? <TableSkeleton/> :
                  results.length === 0 ? (
                     <div className="text-center py-12">
                       <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3"/>
                       <p className="font-medium">No results yet</p>
                       <p className="text-sm text-muted-foreground mt-1">
                         Enter results to see them here.
                       </p>
                       {(isAdmin || isTeacher) && (
                          <Button className="mt-4 bg-blue-600 hover:bg-blue-700"
                                  onClick={() => navigate(`/exams/${id}/results`)}>
                            Enter Results
                          </Button>
                       )}
                     </div>
                  ) : (
                     <>
                       <div className="overflow-x-auto">
                         <table className="w-full text-sm">
                           <thead className="bg-gray-50 dark:bg-gray-800/50">
                           <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                             <th className="text-left px-4 py-3 font-medium">Rank</th>
                             <th className="text-left px-4 py-3 font-medium">Student</th>
                             <th className="text-left px-4 py-3 font-medium">Marks</th>
                             <th className="text-left px-4 py-3 font-medium">Percentage</th>
                             <th className="text-left px-4 py-3 font-medium">Grade</th>
                             <th className="text-left px-4 py-3 font-medium">Result</th>
                           </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                           {results.map((r, idx) => (
                              <tr key={r.id}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                                <td className="px-4 py-3">
                                  <RankBadge rank={(page - 1) * size + idx + 1}/>
                                </td>
                                <td className="px-4 py-3 font-medium">{r.studentName}</td>
                                <td className="px-4 py-3">
                                  <span className="font-semibold">{r.marksObtained}</span>
                                  <span className="text-muted-foreground">/{exam?.totalMarks}</span>
                                </td>
                                <td className="px-4 py-3">
                                  {formatPercentage(r.percentage)}
                                </td>
                                <td className="px-4 py-3">
                                  <GradeBadge grade={r.grade}/>
                                </td>
                                <td className="px-4 py-3">
                                  <StatusBadge status={r.isPassing ? "PASS" : "FAIL"}/>
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
         </TabsContent>
         
         {/* Statistics Tab */}
         <TabsContent value="statistics">
           {statsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Skeleton className="h-64 rounded-xl"/>
                <Skeleton className="h-64 rounded-xl"/>
              </div>
           ) : !stats ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No statistics available yet.
                </CardContent>
              </Card>
           ) : (
              <div className="space-y-4">
                {/* Stats summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Highest Marks", value: stats.highestMarks, icon: TrendingUp, color: "text-green-600" },
                    { label: "Lowest Marks", value: stats.lowestMarks, icon: TrendingUp, color: "text-red-600" },
                    {
                      label: "Class Average",
                      value: stats.averageMarks?.toFixed(1),
                      icon: Users,
                      color: "text-blue-600"
                    },
                    { label: "Topper", value: stats.topperName, icon: Award, color: "text-purple-600" },
                  ].map(({ label, value, icon: Icon, color }) => (
                     <Card key={label}>
                       <CardContent className="p-4">
                         <div className="flex items-start justify-between">
                           <div>
                             <p className="text-xs text-muted-foreground">{label}</p>
                             <p className={`text-lg font-bold mt-0.5 ${color}`}>{value ?? "—"}</p>
                           </div>
                           <Icon className={`w-5 h-5 ${color}`}/>
                         </div>
                       </CardContent>
                     </Card>
                  ))}
                </div>
                
                {/* Grade Distribution Chart */}
                {gradeData.length > 0 && (
                   <Card>
                     <CardHeader className="pb-2">
                       <CardTitle className="text-base">Grade Distribution</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <ResponsiveContainer width="100%" height={220}>
                         <BarChart data={gradeData} barSize={40}
                                   margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                           <XAxis dataKey="grade" tick={{ fontSize: 13 }}/>
                           <YAxis tick={{ fontSize: 12 }} allowDecimals={false}/>
                           <Tooltip/>
                           <Bar dataKey="count" name="Students"
                                fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                         </BarChart>
                       </ResponsiveContainer>
                     </CardContent>
                   </Card>
                )}
              </div>
           )}
         </TabsContent>
       </Tabs>
     </div>
  );
}

function RankBadge ({ rank }) {
  const style = rank === 1 ? "bg-yellow-100 text-yellow-700"
     : rank === 2 ? "bg-gray-100 text-gray-600"
        : rank === 3 ? "bg-orange-100 text-orange-700"
           : "text-muted-foreground";
  return (
     <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${style}`}>
      {rank}
    </span>
  );
}

function GradeBadge ({ grade }) {
  const colors = {
    "A+": "bg-green-100 text-green-700",
    "A": "bg-green-100 text-green-700",
    "B": "bg-blue-100 text-blue-700",
    "C": "bg-yellow-100 text-yellow-700",
    "D": "bg-orange-100 text-orange-700",
    "F": "bg-red-100 text-red-700",
  };
  return (
     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[grade] ?? "bg-gray-100 text-gray-600"}`}>
      {grade ?? "—"}
    </span>
  );
}

function TableSkeleton () {
  return (
     <div className="p-4 space-y-3">
       {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-7 h-7 rounded-full"/>
            <Skeleton className="h-4 flex-1"/>
            <Skeleton className="h-4 w-16"/>
            <Skeleton className="h-4 w-16"/>
            <Skeleton className="h-6 w-12 rounded-full"/>
            <Skeleton className="h-6 w-14 rounded-full"/>
          </div>
       ))}
     </div>
  );
}