import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  TrendingUp, TrendingDown,
  DollarSign, AlertTriangle, CheckCircle, Clock,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid
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
import { feeApi } from "@/api/feeApi";
import { formatCurrency } from "@/utils/formatters";
import { MONTHS } from "@/utils/constants";

const PIE_COLORS = {
  collected: "#22c55e",
  pending: "#eab308",
  overdue: "#ef4444",
};

export default function FinanceSummaryPage () {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    setLoading(true);
    feeApi.getFinanceSummary({ month, year })
       .then((res) => setSummary(res.data))
       .catch(() => toast.error("Failed to load summary"))
       .finally(() => setLoading(false));
  }, [month, year]);
  
  const pieData = summary ? [
    { name: "Collected", value: Number(summary.totalCollected ?? 0), color: PIE_COLORS.collected },
    { name: "Pending", value: Number(summary.totalPending ?? 0), color: PIE_COLORS.pending },
    { name: "Overdue", value: Number(summary.totalOverdue ?? 0), color: PIE_COLORS.overdue },
  ] : [];
  
  const barData = summary?.monthlyBreakdown ?? [];
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Finance Summary"
          backTo="/fees"
          breadcrumbs={[
            { label: "Fees", path: "/fees" },
            { label: "Finance Summary" },
          ]}
       />
       
       {/* Filters */}
       <Card>
         <CardContent className="p-4">
           <div className="flex gap-3">
             <div className="space-y-1">
               <Label className="text-xs">Month</Label>
               <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                 <SelectTrigger className="w-36">
                   <SelectValue/>
                 </SelectTrigger>
                 <SelectContent>
                   {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             <div className="space-y-1">
               <Label className="text-xs">Year</Label>
               <Input type="number" value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-28"/>
             </div>
           </div>
         </CardContent>
       </Card>
       
       {/* Stat Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
         {[
           {
             label: "Total Collected",
             value: formatCurrency(summary?.totalCollected ?? 0),
             icon: CheckCircle,
             color: "text-green-600",
             bg: "bg-green-50 dark:bg-green-900/20",
           },
           {
             label: "Total Pending",
             value: formatCurrency(summary?.totalPending ?? 0),
             icon: Clock,
             color: "text-yellow-600",
             bg: "bg-yellow-50 dark:bg-yellow-900/20",
           },
           {
             label: "Total Overdue",
             value: formatCurrency(summary?.totalOverdue ?? 0),
             icon: AlertTriangle,
             color: "text-red-600",
             bg: "bg-red-50 dark:bg-red-900/20",
           },
           {
             label: "Collection Rate",
             value: summary
                ? `${(
                   (summary.totalCollected /
                      (summary.totalCollected + summary.totalPending + summary.totalOverdue || 1))
                   * 100
                ).toFixed(1)}%`
                : "—",
             icon: TrendingUp,
             color: "text-blue-600",
             bg: "bg-blue-50 dark:bg-blue-900/20",
           },
         ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className={`border-0 ${bg}`}>
              <CardContent className="p-5">
                {loading ? (
                   <div className="space-y-2">
                     <Skeleton className="h-8 w-8 rounded-lg"/>
                     <Skeleton className="h-7 w-28"/>
                     <Skeleton className="h-4 w-24"/>
                   </div>
                ) : (
                   <div className="flex items-start justify-between">
                     <div>
                       <p className="text-sm text-muted-foreground">{label}</p>
                       <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                     </div>
                     <Icon className={`w-6 h-6 ${color}`}/>
                   </div>
                )}
              </CardContent>
            </Card>
         ))}
       </div>
       
       {/* Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         
         {/* Pie Chart */}
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-base">Fee Distribution</CardTitle>
           </CardHeader>
           <CardContent>
             {loading ? <Skeleton className="h-56 w-full"/> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%"
                         innerRadius={60} outerRadius={90}
                         paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => (
                         <Cell key={i} fill={entry.color}/>
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)}/>
                    <Legend/>
                  </PieChart>
                </ResponsiveContainer>
             )}
           </CardContent>
         </Card>
         
         {/* Monthly Bar Chart */}
         <Card>
           <CardHeader className="pb-2">
             <CardTitle className="text-base">Monthly Collection</CardTitle>
           </CardHeader>
           <CardContent>
             {loading ? <Skeleton className="h-56 w-full"/> :
                barData.length === 0 ? (
                   <div className="flex items-center justify-center h-56 text-sm text-muted-foreground">
                     No monthly data available
                   </div>
                ) : (
                   <ResponsiveContainer width="100%" height={220}>
                     <BarChart data={barData} barSize={28}
                               margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                       <XAxis dataKey="month" tick={{ fontSize: 12 }}/>
                       <YAxis tick={{ fontSize: 12 }}
                              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}/>
                       <Tooltip formatter={(v) => formatCurrency(v)}/>
                       <Bar dataKey="collected" name="Collected"
                            fill="#22c55e" radius={[4, 4, 0, 0]}/>
                       <Bar dataKey="pending" name="Pending"
                            fill="#eab308" radius={[4, 4, 0, 0]}/>
                     </BarChart>
                   </ResponsiveContainer>
                )}
           </CardContent>
         </Card>
       </div>
     </div>
  );
}