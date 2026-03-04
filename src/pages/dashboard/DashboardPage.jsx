import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, GraduationCap, UserCog, DollarSign,
  BookOpen, AlertTriangle, ClipboardCheck,
  TrendingUp, TrendingDown, Wrench, Clock,
  ArrowRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from "recharts";
import {
  Card, CardContent,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs, TabsContent,
  TabsList, TabsTrigger
} from "@/components/ui/tabs";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import { dashboardApi } from "@/api/dashboardApi";
import useAuthStore from "@/store/authStore";
import {
  formatCurrency,
  formatDate
} from "@/utils/formatters";

// ── Dummy chart data (replace with real API when available) ──────────────────
const ATTENDANCE_DATA = [
  { day: "Mon", present: 92, absent: 8 },
  { day: "Tue", present: 88, absent: 12 },
  { day: "Wed", present: 95, absent: 5 },
  { day: "Thu", present: 85, absent: 15 },
  { day: "Fri", present: 90, absent: 10 },
];

const FEE_PIE_DATA = [
  { name: "Paid", value: 65, color: "#22c55e" },
  { name: "Pending", value: 25, color: "#eab308" },
  { name: "Overdue", value: 10, color: "#ef4444" },
];

export default function DashboardPage () {
  const { user, isAdmin, isTeacher } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    studentCount: 0,
    teacherCount: 0,
    staffCount: 0,
    finance: null,
    overdueBooks: [],
    lowAttendance: [],
    recentLogs: [],
    defaulters: [],
    pendingLeaves: [],
    openMaint: [],
  });
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        students, teachers, staff,
        finance, overdueBooks, lowAttendance,
        recentLogs, defaulters, pendingLeaves, openMaint,
      ] = await Promise.allSettled([
        dashboardApi.getStudentCount(),
        dashboardApi.getTeacherCount(),
        dashboardApi.getStaffCount(),
        dashboardApi.getFinanceSummary(),
        dashboardApi.getOverdueBooks(),
        dashboardApi.getLowAttendance(),
        dashboardApi.getRecentLogs(),
        dashboardApi.getDefaulters(),
        dashboardApi.getPendingLeaves(),
        dashboardApi.getOpenMaintenance(),
      ]);
      
      setData({
        studentCount: students.value?.data?.total ?? 0,
        teacherCount: teachers.value?.data?.total ?? 0,
        staffCount: staff.value?.data?.total ?? 0,
        finance: finance.value?.data ?? null,
        overdueBooks: overdueBooks.value?.data ?? [],
        lowAttendance: lowAttendance.value?.data ?? [],
        recentLogs: recentLogs.value?.data?.data ?? [],
        defaulters: defaulters.value?.data?.data ?? [],
        pendingLeaves: pendingLeaves.value?.data?.data ?? [],
        openMaint: openMaint.value?.data?.data ?? [],
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
     <div className="space-y-6">
       <PageHeader
          title={`Good ${getGreeting()}, ${user?.username}! 👋`}
          subtitle="Here's what's happening in your school today."
       />
       
       {/* ── Stat Cards ─────────────────────────────────────────── */}
       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
         <StatCard
            title="Total Students"
            value={data.studentCount}
            icon={Users}
            color="blue"
            trend="+12 this month"
            trendUp
            loading={loading}
            onClick={() => navigate("/students")}
         />
         <StatCard
            title="Total Teachers"
            value={data.teacherCount}
            icon={GraduationCap}
            color="purple"
            trend="2 on leave"
            loading={loading}
            onClick={() => navigate("/teachers")}
         />
         <StatCard
            title="Total Staff"
            value={data.staffCount}
            icon={UserCog}
            color="orange"
            trend="All active"
            trendUp
            loading={loading}
            onClick={() => navigate("/staff")}
         />
         <StatCard
            title="Total Collected"
            value={formatCurrency(data.finance?.totalCollected ?? 0)}
            icon={DollarSign}
            color="green"
            trend={`${formatCurrency(data.finance?.totalPending ?? 0)} pending`}
            loading={loading}
            onClick={() => navigate("/fees/summary")}
         />
       </div>
       
       {/* ── Charts Row ─────────────────────────────────────────── */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         
         {/* Attendance Bar Chart */}
         <Card className="lg:col-span-2">
           <CardHeader className="pb-2">
             <CardTitle className="text-base font-semibold">
               Weekly Attendance
             </CardTitle>
           </CardHeader>
           <CardContent>
             {loading ? (
                <Skeleton className="h-52 w-full"/>
             ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={ATTENDANCE_DATA} barSize={24}
                            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="day" tick={{ fontSize: 12 }}/>
                    <YAxis tick={{ fontSize: 12 }}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="present" name="Present" fill="#3b82f6" radius={[4, 4, 0, 0]}/>
                    <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
             )}
           </CardContent>
         </Card>
         
         {/* Fee Distribution Pie */}
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-base font-semibold">
               Fee Distribution
             </CardTitle>
           </CardHeader>
           <CardContent>
             {loading ? (
                <Skeleton className="h-52 w-full"/>
             ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie
                       data={FEE_PIE_DATA}
                       cx="50%" cy="50%"
                       innerRadius={55} outerRadius={80}
                       paddingAngle={3}
                       dataKey="value"
                    >
                      {FEE_PIE_DATA.map((entry, i) => (
                         <Cell key={i} fill={entry.color}/>
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`}/>
                    <Legend/>
                  </PieChart>
                </ResponsiveContainer>
             )}
           </CardContent>
         </Card>
       </div>
       
       {/* ── Alert Cards ────────────────────────────────────────── */}
       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
         <AlertCard
            title="Overdue Books"
            count={data.overdueBooks?.length ?? 0}
            icon={BookOpen}
            color="red"
            loading={loading}
            onClick={() => navigate("/library/issued")}
         />
         <AlertCard
            title="Low Attendance"
            count={data.lowAttendance?.length ?? 0}
            icon={ClipboardCheck}
            color="yellow"
            loading={loading}
            onClick={() => navigate("/attendance")}
         />
         <AlertCard
            title="Fee Defaulters"
            count={data.defaulters?.length ?? 0}
            icon={DollarSign}
            color="red"
            loading={loading}
            onClick={() => navigate("/fees")}
         />
         <AlertCard
            title="Pending Leaves"
            count={data.pendingLeaves?.length ?? 0}
            icon={Clock}
            color="yellow"
            loading={loading}
            onClick={() => navigate("/leave-requests")}
         />
       </div>
       
       {/* ── Tables Row ─────────────────────────────────────────── */}
       <Tabs defaultValue="logs">
         <TabsList>
           {isAdmin && <TabsTrigger value="logs">Recent Activity</TabsTrigger>}
           <TabsTrigger value="defaulters">Fee Defaulters</TabsTrigger>
           <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
           <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
         </TabsList>
         
         {/* Recent Activity Logs */}
         {isAdmin && (
            <TabsContent value="logs">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm"
                          onClick={() => navigate("/activity-logs")}>
                    View all <ArrowRight className="w-3.5 h-3.5 ml-1"/>
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading
                     ? <TableSkeleton rows={5}/>
                     : data.recentLogs.length === 0
                        ? <EmptyRow text="No recent activity"/>
                        : (
                           <table className="w-full text-sm">
                             <thead>
                             <tr className="border-b text-muted-foreground text-xs">
                               <th className="text-left py-2 font-medium">User</th>
                               <th className="text-left py-2 font-medium">Action</th>
                               <th className="text-left py-2 font-medium">Module</th>
                               <th className="text-left py-2 font-medium">Time</th>
                             </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                             {data.recentLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                  <td className="py-2.5 font-medium">{log.username}</td>
                                  <td className="py-2.5">
                                    <StatusBadge status={log.action}/>
                                  </td>
                                  <td className="py-2.5 text-muted-foreground">{log.module}</td>
                                  <td className="py-2.5 text-muted-foreground">
                                    {formatDate(log.createdAt)}
                                  </td>
                                </tr>
                             ))}
                             </tbody>
                           </table>
                        )
                  }
                </CardContent>
              </Card>
            </TabsContent>
         )}
         
         {/* Fee Defaulters */}
         <TabsContent value="defaulters">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-base">Fee Defaulters</CardTitle>
               <Button variant="ghost" size="sm"
                       onClick={() => navigate("/fees")}>
                 View all <ArrowRight className="w-3.5 h-3.5 ml-1"/>
               </Button>
             </CardHeader>
             <CardContent>
               {loading
                  ? <TableSkeleton rows={5}/>
                  : data.defaulters.length === 0
                     ? <EmptyRow text="No defaulters 🎉"/>
                     : (
                        <table className="w-full text-sm">
                          <thead>
                          <tr className="border-b text-muted-foreground text-xs">
                            <th className="text-left py-2 font-medium">Student</th>
                            <th className="text-left py-2 font-medium">Category</th>
                            <th className="text-left py-2 font-medium">Amount</th>
                            <th className="text-left py-2 font-medium">Status</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {data.defaulters.map((d) => (
                             <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                               <td className="py-2.5 font-medium">{d.studentName}</td>
                               <td className="py-2.5 text-muted-foreground">{d.feeCategoryName}</td>
                               <td className="py-2.5">{formatCurrency(d.amountPaid)}</td>
                               <td className="py-2.5">
                                 <StatusBadge status={d.status}/>
                               </td>
                             </tr>
                          ))}
                          </tbody>
                        </table>
                     )
               }
             </CardContent>
           </Card>
         </TabsContent>
         
         {/* Pending Leave Requests */}
         <TabsContent value="leaves">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-base">Pending Leave Requests</CardTitle>
               <Button variant="ghost" size="sm"
                       onClick={() => navigate("/leave-requests")}>
                 View all <ArrowRight className="w-3.5 h-3.5 ml-1"/>
               </Button>
             </CardHeader>
             <CardContent>
               {loading
                  ? <TableSkeleton rows={5}/>
                  : data.pendingLeaves.length === 0
                     ? <EmptyRow text="No pending leave requests"/>
                     : (
                        <table className="w-full text-sm">
                          <thead>
                          <tr className="border-b text-muted-foreground text-xs">
                            <th className="text-left py-2 font-medium">Staff</th>
                            <th className="text-left py-2 font-medium">Type</th>
                            <th className="text-left py-2 font-medium">From</th>
                            <th className="text-left py-2 font-medium">To</th>
                            <th className="text-left py-2 font-medium">Status</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {data.pendingLeaves.map((l) => (
                             <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                               <td className="py-2.5 font-medium">{l.staffName}</td>
                               <td className="py-2.5 text-muted-foreground">
                                 {l.leaveType?.replace(/_/g, " ")}
                               </td>
                               <td className="py-2.5">{formatDate(l.fromDate)}</td>
                               <td className="py-2.5">{formatDate(l.toDate)}</td>
                               <td className="py-2.5">
                                 <StatusBadge status={l.status}/>
                               </td>
                             </tr>
                          ))}
                          </tbody>
                        </table>
                     )
               }
             </CardContent>
           </Card>
         </TabsContent>
         
         {/* Open Maintenance */}
         <TabsContent value="maintenance">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-base">Open Maintenance Issues</CardTitle>
               <Button variant="ghost" size="sm"
                       onClick={() => navigate("/maintenance")}>
                 View all <ArrowRight className="w-3.5 h-3.5 ml-1"/>
               </Button>
             </CardHeader>
             <CardContent>
               {loading
                  ? <TableSkeleton rows={5}/>
                  : data.openMaint.length === 0
                     ? <EmptyRow text="No open maintenance issues 🎉"/>
                     : (
                        <table className="w-full text-sm">
                          <thead>
                          <tr className="border-b text-muted-foreground text-xs">
                            <th className="text-left py-2 font-medium">Facility</th>
                            <th className="text-left py-2 font-medium">Issue</th>
                            <th className="text-left py-2 font-medium">Reported</th>
                            <th className="text-left py-2 font-medium">Status</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {data.openMaint.map((m) => (
                             <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                               <td className="py-2.5 font-medium">{m.facilityName}</td>
                               <td className="py-2.5 text-muted-foreground truncate max-w-[200px]">
                                 {m.issue}
                               </td>
                               <td className="py-2.5">{formatDate(m.reportedDate)}</td>
                               <td className="py-2.5">
                                 <StatusBadge status={m.status}/>
                               </td>
                             </tr>
                          ))}
                          </tbody>
                        </table>
                     )
               }
             </CardContent>
           </Card>
         </TabsContent>
       </Tabs>
     </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard ({ title, value, icon: Icon, color, trend, trendUp, loading, onClick }) {
  const colors = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "bg-blue-100 dark:bg-blue-900/40 text-blue-600" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "bg-purple-100 dark:bg-purple-900/40 text-purple-600" },
    orange: { bg: "bg-orange-50 dark:bg-orange-900/20", icon: "bg-orange-100 dark:bg-orange-900/40 text-orange-600" },
    green: { bg: "bg-green-50 dark:bg-green-900/20", icon: "bg-green-100 dark:bg-green-900/40 text-green-600" },
  };
  const c = colors[color] ?? colors.blue;
  
  return (
     <Card
        className={`cursor-pointer hover:shadow-md transition-shadow ${c.bg} border-0`}
        onClick={onClick}
     >
       <CardContent className="p-5">
         {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-10 rounded-xl"/>
              <Skeleton className="h-7 w-24"/>
              <Skeleton className="h-4 w-32"/>
            </div>
         ) : (
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {value}
                </p>
                {trend && (
                   <div className="flex items-center gap-1 mt-1.5">
                     {trendUp !== undefined && (
                        trendUp
                           ? <TrendingUp className="w-3.5 h-3.5 text-green-500"/>
                           : <TrendingDown className="w-3.5 h-3.5 text-red-500"/>
                     )}
                     <span className="text-xs text-muted-foreground">{trend}</span>
                   </div>
                )}
              </div>
              <div className={`p-3 rounded-xl ${c.icon}`}>
                <Icon className="w-5 h-5"/>
              </div>
            </div>
         )}
       </CardContent>
     </Card>
  );
}

function AlertCard ({ title, count, icon: Icon, color, loading, onClick }) {
  const colors = {
    red: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30",
  };
  const iconColors = {
    red: "text-red-500",
    yellow: "text-yellow-500",
  };
  
  return (
     <Card
        className={`cursor-pointer hover:shadow-md transition-shadow ${colors[color]} border`}
        onClick={onClick}
     >
       <CardContent className="p-5">
         {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-8"/>
              <Skeleton className="h-6 w-12"/>
              <Skeleton className="h-4 w-28"/>
            </div>
         ) : (
            <div className="flex items-center gap-4">
              <Icon className={`w-8 h-8 shrink-0 ${iconColors[color]}`}/>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
            </div>
         )}
       </CardContent>
     </Card>
  );
}

function TableSkeleton ({ rows = 5 }) {
  return (
     <div className="space-y-3">
       {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full"/>
       ))}
     </div>
  );
}

function EmptyRow ({ text }) {
  return (
     <div className="text-center py-10 text-sm text-muted-foreground">{text}</div>
  );
}

function getGreeting () {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}