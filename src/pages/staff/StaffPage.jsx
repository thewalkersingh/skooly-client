import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// Then in LeaveFormDialog and PayrollFormDialog,
// remove the require() calls and use the imported components directly
import {
  Plus, Eye, Pencil, Trash2,
  Users, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { staffApi } from "@/api/staffApi";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { getInitials, getFullName, formatDate, formatCurrency } from "@/utils/formatters";
import useAuthStore from "@/store/authStore";

export default function StaffPage () {
  const { isAdmin } = useAuthStore();
  const navigate = useNavigate();
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Staff & HR"
          subtitle="Manage staff, leaves and payroll"
          actions={
             isAdmin && (
                <Button onClick={() => navigate("/staff/new")}
                        className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2"/> Add Staff
                </Button>
             )
          }
       />
       <Tabs defaultValue="staff">
         <TabsList>
           <TabsTrigger value="staff">Staff</TabsTrigger>
           <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
           <TabsTrigger value="payroll">Payroll</TabsTrigger>
         </TabsList>
         <TabsContent value="staff"> <StaffTab/> </TabsContent>
         <TabsContent value="leaves"> <LeavesTab/> </TabsContent>
         <TabsContent value="payroll"> <PayrollTab/> </TabsContent>
       </Tabs>
     </div>
  );
}

// ── Staff Tab ─────────────────────────────────────────────────────────────────
function StaffTab () {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [staff, setStaff] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);
  
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffApi.getAll({
        page, size,
        search: debouncedSearch || undefined,
        department: department || undefined,
        status: status || undefined,
      });
      setStaff(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch staff"); } finally { setLoading(false); }
  }, [page, size, debouncedSearch, department, status]);
  
  useEffect(() => { fetchStaff(); }, [fetchStaff]);
  useEffect(() => { reset(); }, [debouncedSearch, department, status]);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await staffApi.delete(deleteId);
      toast.success("Staff member deleted");
      setDeleteId(null);
      fetchStaff();
    } catch { toast.error("Failed to delete staff member"); } finally { setDeleting(false); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <SearchBar value={search} onChange={setSearch}
                        placeholder="Search staff..." className="flex-1 min-w-[200px]"/>
             <Select value={department} onValueChange={setDepartment}>
               <SelectTrigger className="w-44">
                 <SelectValue placeholder="Department"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Departments</SelectItem>
                 {["Administration", "Finance", "Maintenance", "Security",
                   "IT", "Library", "Transport", "Canteen"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <Select value={status} onValueChange={setStatus}>
               <SelectTrigger className="w-36">
                 <SelectValue placeholder="Status"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Status</SelectItem>
                 <SelectItem value="ACTIVE">Active</SelectItem>
                 <SelectItem value="INACTIVE">Inactive</SelectItem>
                 <SelectItem value="ON_LEAVE">On Leave</SelectItem>
               </SelectContent>
             </Select>
             {(search || department || status) && (
                <Button variant="outline"
                        onClick={() => {
                          setSearch("");
                          setDepartment("");
                          setStatus("");
                        }}>
                  Clear
                </Button>
             )}
           </div>
         </CardContent>
       </Card>
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={7}/> :
              staff.length === 0 ? (
                 <EmptyState icon={Users} title="No staff found"
                             description="Add your first staff member to get started."
                             action={isAdmin && (
                                <Button onClick={() => navigate("/staff/new")}
                                        className="bg-blue-600 hover:bg-blue-700">
                                  <Plus className="w-4 h-4 mr-2"/> Add Staff
                                </Button>
                             )}
                 />
              ) : (
                 <>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-gray-50 dark:bg-gray-800/50">
                       <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                         <th className="text-left px-4 py-3 font-medium">Staff Member</th>
                         <th className="text-left px-4 py-3 font-medium">Employee ID</th>
                         <th className="text-left px-4 py-3 font-medium">Department</th>
                         <th className="text-left px-4 py-3 font-medium">Designation</th>
                         <th className="text-left px-4 py-3 font-medium">Phone</th>
                         <th className="text-left px-4 py-3 font-medium">Status</th>
                         <th className="text-right px-4 py-3 font-medium">Actions</th>
                       </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {staff.map((s) => (
                          <StaffRow
                             key={s.id} member={s} canEdit={isAdmin}
                             onView={() => navigate(`/staff/${s.id}`)}
                             onEdit={() => navigate(`/staff/${s.id}/edit`)}
                             onDelete={() => setDeleteId(s.id)}
                          />
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
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Staff Member"
                      description="Are you sure you want to delete this staff member?"
                      confirmLabel="Delete" isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

function StaffRow ({ member, canEdit, onView, onEdit, onDelete }) {
  return (
     <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
       <td className="px-4 py-3">
         <div className="flex items-center gap-3">
           <Avatar className="w-9 h-9 shrink-0">
             <AvatarImage
                src={member.photo ? `/uploads/${member.photo}` : undefined}
             />
             <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-semibold">
               {getInitials(member.firstName, member.lastName)}
             </AvatarFallback>
           </Avatar>
           <div>
             <p className="font-medium text-gray-900 dark:text-white">
               {getFullName(member.firstName, member.lastName)}
             </p>
             <p className="text-xs text-muted-foreground">{member.email ?? "—"}</p>
           </div>
         </div>
       </td>
       <td className="px-4 py-3 text-muted-foreground">{member.employeeId ?? "—"}</td>
       <td className="px-4 py-3">{member.department ?? "—"}</td>
       <td className="px-4 py-3 text-muted-foreground">{member.designation ?? "—"}</td>
       <td className="px-4 py-3 text-muted-foreground">{member.phone ?? "—"}</td>
       <td className="px-4 py-3"><StatusBadge status={member.status}/></td>
       <td className="px-4 py-3">
         <div className="flex items-center justify-end gap-1">
           <button onClick={onView}
                   className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-blue-600">
             <Eye className="w-4 h-4"/>
           </button>
           {canEdit && (
              <>
                <button onClick={onEdit}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                  <Pencil className="w-4 h-4"/>
                </button>
                <button onClick={onDelete}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </>
           )}
         </div>
       </td>
     </tr>
  );
}

// ── Leaves Tab ────────────────────────────────────────────────────────────────
function LeavesTab () {
  const { isAdmin } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [leaves, setLeaves] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [acting, setActing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffApi.getLeaves({
        page, size,
        status: status || undefined,
      });
      setLeaves(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch leaves"); } finally { setLoading(false); }
  }, [page, size, status]);
  
  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);
  useEffect(() => { reset(); }, [status]);
  
  const handleApprove = async (id) => {
    setActing(id);
    try {
      await staffApi.approveLeave(id);
      toast.success("Leave approved");
      fetchLeaves();
    } catch { toast.error("Failed to approve leave"); } finally { setActing(null); }
  };
  
  const handleReject = async (id) => {
    setActing(id);
    try {
      await staffApi.rejectLeave(id);
      toast.success("Leave rejected");
      fetchLeaves();
    } catch { toast.error("Failed to reject leave"); } finally { setActing(null); }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await staffApi.deleteLeave(deleteId);
      toast.success("Leave request deleted");
      setDeleteId(null);
      fetchLeaves();
    } catch { toast.error("Failed to delete"); } finally { setDeleting(false); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       <div className="flex flex-wrap gap-3">
         <Select value={status} onValueChange={setStatus}>
           <SelectTrigger className="w-40">
             <SelectValue placeholder="All Status"/>
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="">All</SelectItem>
             <SelectItem value="PENDING">Pending</SelectItem>
             <SelectItem value="APPROVED">Approved</SelectItem>
             <SelectItem value="REJECTED">Rejected</SelectItem>
           </SelectContent>
         </Select>
         <Button onClick={() => setShowForm(true)}
                 className="bg-blue-600 hover:bg-blue-700 ml-auto">
           <Plus className="w-4 h-4 mr-2"/> Apply Leave
         </Button>
       </div>
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={7}/> :
              leaves.length === 0 ? (
                 <EmptyState icon={Briefcase} title="No leave requests"
                             description="No leave requests match your filter."/>
              ) : (
                 <>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-gray-50 dark:bg-gray-800/50">
                       <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                         <th className="text-left px-4 py-3 font-medium">Staff</th>
                         <th className="text-left px-4 py-3 font-medium">Type</th>
                         <th className="text-left px-4 py-3 font-medium">From</th>
                         <th className="text-left px-4 py-3 font-medium">To</th>
                         <th className="text-left px-4 py-3 font-medium">Days</th>
                         <th className="text-left px-4 py-3 font-medium">Status</th>
                         <th className="text-right px-4 py-3 font-medium">Actions</th>
                       </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {leaves.map((leave) => {
                         const days = Math.ceil(
                            (new Date(leave.endDate) - new Date(leave.startDate))
                            / (1000 * 60 * 60 * 24)
                         ) + 1;
                         return (
                            <tr key={leave.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                              <td className="px-4 py-3 font-medium">{leave.staffName}</td>
                              <td className="px-4 py-3">
                                <LeaveTypeBadge type={leave.leaveType}/>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {formatDate(leave.startDate)}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {formatDate(leave.endDate)}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">{days}</td>
                              <td className="px-4 py-3">
                                <StatusBadge status={leave.status}/>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                  {isAdmin && leave.status === "PENDING" && (
                                     <>
                                       <button
                                          onClick={() => handleApprove(leave.id)}
                                          disabled={acting === leave.id}
                                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50">
                                         Approve
                                       </button>
                                       <button
                                          onClick={() => handleReject(leave.id)}
                                          disabled={acting === leave.id}
                                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50">
                                         Reject
                                       </button>
                                     </>
                                  )}
                                  {(isAdmin || leave.status === "PENDING") && (
                                     <button onClick={() => setDeleteId(leave.id)}
                                             className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                                       <Trash2 className="w-4 h-4"/>
                                     </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                         );
                       })}
                       </tbody>
                     </table>
                   </div>
                   <Pagination page={page} totalPages={totalPages}
                               total={total} size={size} onPageChange={setPage}/>
                 </>
              )}
         </CardContent>
       </Card>
       
       <LeaveFormDialog
          open={showForm}
          onOpenChange={setShowForm}
          onSuccess={() => {
            setShowForm(false);
            fetchLeaves();
          }}
       />
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Leave Request"
                      description="Delete this leave request?"
                      confirmLabel="Delete" isLoading={deleting}
                      onConfirm={handleDelete}
       />
     </div>
  );
}

function LeaveTypeBadge ({ type }) {
  const colors = {
    SICK: "bg-red-100    text-red-700",
    CASUAL: "bg-blue-100   text-blue-700",
    EARNED: "bg-green-100  text-green-700",
    MATERNITY: "bg-pink-100   text-pink-700",
    PATERNITY: "bg-indigo-100 text-indigo-700",
    UNPAID: "bg-gray-100   text-gray-600",
  };
  return (
     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] ?? "bg-gray-100 text-gray-700"}`}>
      {type?.replace(/_/g, " ") ?? "—"}
    </span>
  );
}

// ── Payroll Tab ───────────────────────────────────────────────────────────────
function PayrollTab () {
  const { isAdmin } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [payrolls, setPayrolls] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [processing, setProcessing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const fetchPayrolls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffApi.getPayrolls({ page, size, month, year });
      setPayrolls(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch payroll"); } finally { setLoading(false); }
  }, [page, size, month, year]);
  
  useEffect(() => { fetchPayrolls(); }, [fetchPayrolls]);
  useEffect(() => { reset(); }, [month, year]);
  
  const handleProcess = async (id) => {
    setProcessing(id);
    try {
      await staffApi.processPayroll(id);
      toast.success("Payroll processed");
      fetchPayrolls();
    } catch { toast.error("Failed to process payroll"); } finally { setProcessing(null); }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await staffApi.deletePayroll(deleteId);
      toast.success("Payroll record deleted");
      setDeleteId(null);
      fetchPayrolls();
    } catch { toast.error("Failed to delete payroll"); } finally { setDeleting(false); }
  };
  
  const MONTHS = [
    { value: 1, label: "January" }, { value: 2, label: "February" },
    { value: 3, label: "March" }, { value: 4, label: "April" },
    { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" },
    { value: 9, label: "September" }, { value: 10, label: "October" },
    { value: 11, label: "November" }, { value: 12, label: "December" },
  ];
  
  return (
     <div className="space-y-4 mt-4">
       <div className="flex flex-wrap gap-3 items-end">
         <div className="space-y-1">
           <label className="text-xs text-muted-foreground">Month</label>
           <Select value={String(month)}
                   onValueChange={(v) => setMonth(Number(v))}>
             <SelectTrigger className="w-36">
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
         <div className="space-y-1">
           <label className="text-xs text-muted-foreground">Year</label>
           <input
              type="number" value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="flex h-9 w-24 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
           />
         </div>
         {isAdmin && (
            <Button onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 ml-auto">
              <Plus className="w-4 h-4 mr-2"/> Add Payroll
            </Button>
         )}
       </div>
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={7}/> :
              payrolls.length === 0 ? (
                 <EmptyState icon={Briefcase} title="No payroll records"
                             description="No payroll records for this period."/>
              ) : (
                 <>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-gray-50 dark:bg-gray-800/50">
                       <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                         <th className="text-left px-4 py-3 font-medium">Staff</th>
                         <th className="text-left px-4 py-3 font-medium">Basic</th>
                         <th className="text-left px-4 py-3 font-medium">Allowances</th>
                         <th className="text-left px-4 py-3 font-medium">Deductions</th>
                         <th className="text-left px-4 py-3 font-medium">Net Pay</th>
                         <th className="text-left px-4 py-3 font-medium">Status</th>
                         <th className="text-right px-4 py-3 font-medium">Actions</th>
                       </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {payrolls.map((p) => (
                          <tr key={p.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-4 py-3 font-medium">{p.staffName}</td>
                            <td className="px-4 py-3">
                              {formatCurrency(p.basicSalary)}
                            </td>
                            <td className="px-4 py-3 text-green-600">
                              +{formatCurrency(p.allowances ?? 0)}
                            </td>
                            <td className="px-4 py-3 text-red-600">
                              -{formatCurrency(p.deductions ?? 0)}
                            </td>
                            <td className="px-4 py-3 font-semibold">
                              {formatCurrency(p.netSalary)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={p.status}/>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                {isAdmin && p.status === "PENDING" && (
                                   <button
                                      onClick={() => handleProcess(p.id)}
                                      disabled={processing === p.id}
                                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50">
                                     {processing === p.id ? "..." : "Process"}
                                   </button>
                                )}
                                {isAdmin && (
                                   <button onClick={() => setDeleteId(p.id)}
                                           className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                                     <Trash2 className="w-4 h-4"/>
                                   </button>
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
       
       <PayrollFormDialog
          open={showForm}
          onOpenChange={setShowForm}
          month={month} year={year}
          onSuccess={() => {
            setShowForm(false);
            fetchPayrolls();
          }}
       />
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Payroll Record"
                      description="Delete this payroll record?"
                      confirmLabel="Delete" isLoading={deleting}
                      onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Leave Form Dialog ─────────────────────────────────────────────────────────
function LeaveFormDialog ({ open, onOpenChange, onSuccess }) {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    staffId: "", leaveType: "", startDate: "", endDate: "", reason: "",
  });
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (!open) return;
    staffApi.getAll({ status: "ACTIVE", page: 1, size: 200 })
       .then((res) => setStaffList(res.data?.data ?? []));
  }, [open]);
  
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const handleSave = async () => {
    const { staffId, leaveType, startDate, endDate, reason } = form;
    if (!staffId || !leaveType || !startDate || !endDate || !reason) {
      toast.error("All fields are required");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date must be on or after start date");
      return;
    }
    setSaving(true);
    try {
      await staffApi.createLeave({
        staffId: Number(staffId),
        leaveType,
        startDate,
        endDate,
        reason,
      });
      toast.success("Leave request submitted");
      setForm({ staffId: "", leaveType: "", startDate: "", endDate: "", reason: "" });
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };
  
  const { Input } = require("@/components/ui/input");
  const { Textarea } = require("@/components/ui/textarea");
  const { Label } = require("@/components/ui/label");
  const { Loader2 } = require("lucide-react");
  
  const F = ({ label, children }) => (
     <div className="space-y-1.5">
       <Label className="text-xs">{label}</Label>
       {children}
     </div>
  );
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>Apply Leave Request</DialogTitle>
         </DialogHeader>
         <div className="space-y-4 py-2">
           <F label="Staff Member *">
             <Select value={form.staffId} onValueChange={(v) => set("staffId", v)}>
               <SelectTrigger><SelectValue placeholder="Select staff"/></SelectTrigger>
               <SelectContent>
                 {staffList.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {getFullName(s.firstName, s.lastName)}
                    </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           <F label="Leave Type *">
             <Select value={form.leaveType} onValueChange={(v) => set("leaveType", v)}>
               <SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger>
               <SelectContent>
                 {["SICK", "CASUAL", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           <div className="grid grid-cols-2 gap-4">
             <F label="Start Date *">
               <input type="date" value={form.startDate}
                      onChange={(e) => set("startDate", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"/>
             </F>
             <F label="End Date *">
               <input type="date" value={form.endDate}
                      onChange={(e) => set("endDate", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"/>
             </F>
           </div>
           <F label="Reason *">
            <textarea
               placeholder="Reason for leave..."
               rows={3}
               value={form.reason}
               onChange={(e) => set("reason", e.target.value)}
               className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm resize-none"
            />
           </F>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={saving}
                   className="bg-blue-600 hover:bg-blue-700">
             {saving &&
                <span className="mr-2 h-4 w-4 animate-spin inline-block border-2 border-white border-t-transparent rounded-full"/>}
             Submit
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}

// ── Payroll Form Dialog ───────────────────────────────────────────────────────
function PayrollFormDialog ({ open, onOpenChange, month, year, onSuccess }) {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    staffId: "", basicSalary: "", allowances: "",
    deductions: "", paymentDate: "",
  });
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (!open) return;
    staffApi.getAll({ status: "ACTIVE", page: 1, size: 200 })
       .then((res) => setStaffList(res.data?.data ?? []));
  }, [open]);
  
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const netSalary = (
     Number(form.basicSalary || 0)
     + Number(form.allowances || 0)
     - Number(form.deductions || 0)
  );
  
  const handleSave = async () => {
    if (!form.staffId || !form.basicSalary) {
      toast.error("Staff and basic salary are required");
      return;
    }
    setSaving(true);
    try {
      await staffApi.createPayroll({
        staffId: Number(form.staffId),
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances || 0),
        deductions: Number(form.deductions || 0),
        netSalary,
        month, year,
        paymentDate: form.paymentDate || undefined,
      });
      toast.success("Payroll record created");
      setForm({ staffId: "", basicSalary: "", allowances: "", deductions: "", paymentDate: "" });
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };
  
  const F = ({ label, children }) => (
     <div className="space-y-1.5">
       <label className="text-xs text-muted-foreground">{label}</label>
       {children}
     </div>
  );
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>Add Payroll Record</DialogTitle>
         </DialogHeader>
         <div className="grid grid-cols-2 gap-4 py-2">
           <F label="Staff Member *">
             <Select value={form.staffId} onValueChange={(v) => set("staffId", v)}>
               <SelectTrigger className="col-span-2">
                 <SelectValue placeholder="Select staff"/>
               </SelectTrigger>
               <SelectContent>
                 {staffList.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {getFullName(s.firstName, s.lastName)}
                    </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           
           <F label="Basic Salary (₹) *">
             <input type="number" min="0" placeholder="50000"
                    value={form.basicSalary}
                    onChange={(e) => set("basicSalary", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"/>
           </F>
           
           <F label="Allowances (₹)">
             <input type="number" min="0" placeholder="5000"
                    value={form.allowances}
                    onChange={(e) => set("allowances", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"/>
           </F>
           
           <F label="Deductions (₹)">
             <input type="number" min="0" placeholder="2000"
                    value={form.deductions}
                    onChange={(e) => set("deductions", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"/>
           </F>
           
           <F label="Payment Date">
             <input type="date" value={form.paymentDate}
                    onChange={(e) => set("paymentDate", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"/>
           </F>
           
           {/* Net preview */}
           <div className="col-span-2 flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
             <span className="text-sm text-muted-foreground">Net Salary</span>
             <span className="text-lg font-bold text-blue-600">
              {formatCurrency(netSalary)}
            </span>
           </div>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={saving}
                   className="bg-blue-600 hover:bg-blue-700">
             {saving &&
                <span className="mr-2 h-4 w-4 animate-spin inline-block border-2 border-white border-t-transparent rounded-full"/>}
             Create
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}

function TableSkeleton ({ cols = 5 }) {
  return (
     <div className="p-4 space-y-3">
       {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            {Array.from({ length: cols }).map((_, j) => (
               <Skeleton key={j} className="h-4 flex-1"/>
            ))}
          </div>
       ))}
     </div>
  );
}