import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus, Eye, Pencil, Trash2,
  DollarSign, Settings, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { feeApi } from "@/api/feeApi";
import { classApi } from "@/api/classApi";
import { studentApi } from "@/api/studentApi";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { MONTHS } from "@/utils/constants";
import useAuthStore from "@/store/authStore";

export default function FeesPage () {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Fees & Finance"
          subtitle="Manage fee categories, structures and payments"
          actions={
             isAdmin && (
                <div className="flex gap-2">
                  <Button variant="outline"
                          onClick={() => navigate("/fees/summary")}>
                    <DollarSign className="w-4 h-4 mr-2"/> Summary
                  </Button>
                  <Button onClick={() => navigate("/fees/payment")}
                          className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2"/> Record Payment
                  </Button>
                </div>
             )
          }
       />
       
       <Tabs defaultValue="payments">
         <TabsList>
           <TabsTrigger value="payments">Payments</TabsTrigger>
           <TabsTrigger value="categories">Categories</TabsTrigger>
           <TabsTrigger value="structures">Structures</TabsTrigger>
           <TabsTrigger value="defaulters">Defaulters</TabsTrigger>
         </TabsList>
         
         <TabsContent value="payments"><PaymentsTab/></TabsContent>
         <TabsContent value="categories"><CategoriesTab/></TabsContent>
         <TabsContent value="structures"><StructuresTab/></TabsContent>
         <TabsContent value="defaulters"><DefaultersTab/></TabsContent>
       </Tabs>
     </div>
  );
}

// ── Payments Tab ──────────────────────────────────────────────────────────────
function PaymentsTab () {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);
  
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await feeApi.getPayments({
        page, size,
        search: debouncedSearch || undefined,
        status: status || undefined,
        month: month || undefined,
        year: year || undefined,
      });
      setPayments(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch {
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }, [page, size, debouncedSearch, status, month, year]);
  
  useEffect(() => { fetchPayments(); }, [fetchPayments]);
  useEffect(() => { reset(); }, [debouncedSearch, status, month, year]);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await feeApi.deletePayment(deleteId);
      toast.success("Payment deleted");
      setDeleteId(null);
      fetchPayments();
    } catch {
      toast.error("Failed to delete payment");
    } finally {
      setDeleting(false);
    }
  };
  
  return (
     <div className="space-y-4 mt-4">
       {/* Filters */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <SearchBar value={search} onChange={setSearch}
                        placeholder="Search by student name..."
                        className="flex-1 min-w-[200px]"/>
             
             <Select value={status} onValueChange={setStatus}>
               <SelectTrigger className="w-36">
                 <SelectValue placeholder="Status"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Status</SelectItem>
                 <SelectItem value="PAID">Paid</SelectItem>
                 <SelectItem value="PENDING">Pending</SelectItem>
                 <SelectItem value="OVERDUE">Overdue</SelectItem>
                 <SelectItem value="PARTIAL">Partial</SelectItem>
               </SelectContent>
             </Select>
             
             <Select value={month} onValueChange={setMonth}>
               <SelectTrigger className="w-36">
                 <SelectValue placeholder="Month"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Months</SelectItem>
                 {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             
             <Input
                type="number" placeholder="Year"
                value={year} onChange={(e) => setYear(e.target.value)}
                className="w-28"
             />
             
             {(search || status || month || year) && (
                <Button variant="outline" onClick={() => {
                  setSearch("");
                  setStatus("");
                  setMonth("");
                  setYear("");
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
           {loading ? <TableSkeleton cols={7}/> :
              payments.length === 0 ? (
                 <EmptyState icon={DollarSign} title="No payments found"
                             description="No fee payments match your filters."
                             action={
                                isAdmin && (
                                   <Button onClick={() => navigate("/fees/payment")}
                                           className="bg-blue-600 hover:bg-blue-700">
                                     <Plus className="w-4 h-4 mr-2"/> Record Payment
                                   </Button>
                                )
                             }
                 />
              ) : (
                 <>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-gray-50 dark:bg-gray-800/50">
                       <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                         <th className="text-left px-4 py-3 font-medium">Student</th>
                         <th className="text-left px-4 py-3 font-medium">Category</th>
                         <th className="text-left px-4 py-3 font-medium">Amount</th>
                         <th className="text-left px-4 py-3 font-medium">Paid</th>
                         <th className="text-left px-4 py-3 font-medium">Due Date</th>
                         <th className="text-left px-4 py-3 font-medium">Status</th>
                         <th className="text-right px-4 py-3 font-medium">Actions</th>
                       </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {payments.map((p) => (
                          <tr key={p.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-4 py-3 font-medium">{p.studentName}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {p.feeCategoryName}
                            </td>
                            <td className="px-4 py-3">
                              {formatCurrency(p.totalAmount)}
                            </td>
                            <td className="px-4 py-3 text-green-600 font-medium">
                              {formatCurrency(p.amountPaid)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {formatDate(p.dueDate)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={p.status}/>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
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
       
       <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(o) => !o && setDeleteId(null)}
          title="Delete Payment"
          description="Are you sure you want to delete this payment record?"
          confirmLabel="Delete" isLoading={deleting}
          onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Categories Tab ────────────────────────────────────────────────────────────
function CategoriesTab () {
  const { isAdmin } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const fetch = async () => {
    setLoading(true);
    try {
      const res = await feeApi.getCategories({ page: 1, size: 100 });
      setCategories(res.data?.data ?? []);
    } catch { toast.error("Failed to load categories"); } finally { setLoading(false); }
  };
  
  useEffect(() => { fetch(); }, []);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await feeApi.deleteCategory(deleteId);
      toast.success("Category deleted");
      setDeleteId(null);
      fetch();
    } catch { toast.error("Failed to delete category"); } finally { setDeleting(false); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       {isAdmin && (
          <div className="flex justify-end">
            <Button onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2"/> Add Category
            </Button>
          </div>
       )}
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={4}/> :
              categories.length === 0 ? (
                 <EmptyState icon={Settings} title="No categories"
                             description="Add fee categories to get started."/>
              ) : (
                 <table className="w-full text-sm">
                   <thead className="bg-gray-50 dark:bg-gray-800/50">
                   <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                     <th className="text-left px-4 py-3 font-medium">Name</th>
                     <th className="text-left px-4 py-3 font-medium">Description</th>
                     <th className="text-left px-4 py-3 font-medium">Created</th>
                     {isAdmin && <th className="text-right px-4 py-3 font-medium">Actions</th>}
                   </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {categories.map((c) => (
                      <tr key={c.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {c.description ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(c.createdAt)}
                        </td>
                        {isAdmin && (
                           <td className="px-4 py-3">
                             <div className="flex items-center justify-end gap-1">
                               <button onClick={() => {
                                 setEditData(c);
                                 setShowForm(true);
                               }}
                                       className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                                 <Pencil className="w-4 h-4"/>
                               </button>
                               <button onClick={() => setDeleteId(c.id)}
                                       className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                                 <Trash2 className="w-4 h-4"/>
                               </button>
                             </div>
                           </td>
                        )}
                      </tr>
                   ))}
                   </tbody>
                 </table>
              )}
         </CardContent>
       </Card>
       
       <CategoryFormDialog open={showForm}
                           onOpenChange={(o) => {
                             setShowForm(o);
                             if (!o) setEditData(null);
                           }}
                           editData={editData}
                           onSuccess={() => {
                             setShowForm(false);
                             setEditData(null);
                             fetch();
                           }}
       />
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Category" confirmLabel="Delete"
                      description="Delete this fee category?"
                      isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Structures Tab ────────────────────────────────────────────────────────────
function StructuresTab () {
  const { isAdmin } = useAuthStore();
  const [structures, setStructures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, c, cl] = await Promise.all([
        feeApi.getStructures({ page: 1, size: 100 }),
        feeApi.getCategories({ page: 1, size: 100 }),
        classApi.getAll({ page: 1, size: 100 }),
      ]);
      setStructures(s.data?.data ?? []);
      setCategories(c.data?.data ?? []);
      setClasses(cl.data?.data ?? []);
    } catch { toast.error("Failed to load structures"); } finally { setLoading(false); }
  };
  
  useEffect(() => { fetchAll(); }, []);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await feeApi.deleteStructure(deleteId);
      toast.success("Structure deleted");
      setDeleteId(null);
      fetchAll();
    } catch { toast.error("Failed to delete"); } finally { setDeleting(false); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       {isAdmin && (
          <div className="flex justify-end">
            <Button onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2"/> Add Structure
            </Button>
          </div>
       )}
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={5}/> :
              structures.length === 0 ? (
                 <EmptyState icon={Settings} title="No structures"
                             description="Add fee structures to define amounts per class."/>
              ) : (
                 <table className="w-full text-sm">
                   <thead className="bg-gray-50 dark:bg-gray-800/50">
                   <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                     <th className="text-left px-4 py-3 font-medium">Category</th>
                     <th className="text-left px-4 py-3 font-medium">Class</th>
                     <th className="text-left px-4 py-3 font-medium">Amount</th>
                     <th className="text-left px-4 py-3 font-medium">Academic Year</th>
                     {isAdmin && <th className="text-right px-4 py-3 font-medium">Actions</th>}
                   </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {structures.map((s) => (
                      <tr key={s.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                        <td className="px-4 py-3 font-medium">{s.feeCategoryName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.className}</td>
                        <td className="px-4 py-3 font-medium text-green-600">
                          {formatCurrency(s.amount)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {s.academicYear}
                        </td>
                        {isAdmin && (
                           <td className="px-4 py-3">
                             <div className="flex items-center justify-end gap-1">
                               <button onClick={() => {
                                 setEditData(s);
                                 setShowForm(true);
                               }}
                                       className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                                 <Pencil className="w-4 h-4"/>
                               </button>
                               <button onClick={() => setDeleteId(s.id)}
                                       className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                                 <Trash2 className="w-4 h-4"/>
                               </button>
                             </div>
                           </td>
                        )}
                      </tr>
                   ))}
                   </tbody>
                 </table>
              )}
         </CardContent>
       </Card>
       
       <StructureFormDialog open={showForm}
                            onOpenChange={(o) => {
                              setShowForm(o);
                              if (!o) setEditData(null);
                            }}
                            editData={editData} categories={categories} classes={classes}
                            onSuccess={() => {
                              setShowForm(false);
                              setEditData(null);
                              fetchAll();
                            }}
       />
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Structure" confirmLabel="Delete"
                      description="Delete this fee structure?"
                      isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Defaulters Tab ────────────────────────────────────────────────────────────
function DefaultersTab () {
  const [defaulters, setDefaulters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const { page, size, setPage } = usePagination();
  
  useEffect(() => {
    classApi.getAll({ page: 1, size: 100 })
       .then((res) => setClasses(res.data?.data ?? []));
  }, []);
  
  useEffect(() => {
    setLoading(true);
    feeApi.getDefaulters({ classId: classId || undefined, page, size })
       .then((res) => setDefaulters(res.data?.data ?? []))
       .catch(() => toast.error("Failed to load defaulters"))
       .finally(() => setLoading(false));
  }, [classId, page, size]);
  
  return (
     <div className="space-y-4 mt-4">
       <Card>
         <CardContent className="p-4">
           <div className="flex gap-3">
             <Select value={classId} onValueChange={setClassId}>
               <SelectTrigger className="w-48">
                 <SelectValue placeholder="Filter by class"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Classes</SelectItem>
                 {classes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </CardContent>
       </Card>
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={5}/> :
              defaulters.length === 0 ? (
                 <EmptyState icon={DollarSign}
                             title="No defaulters 🎉"
                             description="All students are up to date with their fees."
                 />
              ) : (
                 <table className="w-full text-sm">
                   <thead className="bg-gray-50 dark:bg-gray-800/50">
                   <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                     <th className="text-left px-4 py-3 font-medium">Student</th>
                     <th className="text-left px-4 py-3 font-medium">Class</th>
                     <th className="text-left px-4 py-3 font-medium">Category</th>
                     <th className="text-left px-4 py-3 font-medium">Total</th>
                     <th className="text-left px-4 py-3 font-medium">Paid</th>
                     <th className="text-left px-4 py-3 font-medium">Balance</th>
                     <th className="text-left px-4 py-3 font-medium">Status</th>
                   </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {defaulters.map((d) => (
                      <tr key={d.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                        <td className="px-4 py-3 font-medium">{d.studentName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{d.className}</td>
                        <td className="px-4 py-3 text-muted-foreground">{d.feeCategoryName}</td>
                        <td className="px-4 py-3">{formatCurrency(d.totalAmount)}</td>
                        <td className="px-4 py-3 text-green-600">{formatCurrency(d.amountPaid)}</td>
                        <td className="px-4 py-3 text-red-600 font-medium">
                          {formatCurrency(d.totalAmount - d.amountPaid)}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={d.status}/></td>
                      </tr>
                   ))}
                   </tbody>
                 </table>
              )}
         </CardContent>
       </Card>
     </div>
  );
}

// ── Category Form Dialog ──────────────────────────────────────────────────────
function CategoryFormDialog ({ open, onOpenChange, editData, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    setName(editData?.name ?? "");
    setDescription(editData?.description ?? "");
  }, [editData, open]);
  
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { name: name.trim(), description: description.trim() || undefined };
      editData
         ? await feeApi.updateCategory(editData.id, payload)
         : await feeApi.createCategory(payload);
      toast.success(editData ? "Category updated" : "Category created");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-sm">
         <DialogHeader>
           <DialogTitle>{editData ? "Edit Category" : "Add Category"}</DialogTitle>
         </DialogHeader>
         <div className="space-y-4 py-2">
           <div className="space-y-1.5">
             <Label>Name *</Label>
             <Input placeholder="e.g. Tuition Fee"
                    value={name} onChange={(e) => setName(e.target.value)}/>
           </div>
           <div className="space-y-1.5">
             <Label>Description</Label>
             <Input placeholder="Optional description"
                    value={description} onChange={(e) => setDescription(e.target.value)}/>
           </div>
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

// ── Structure Form Dialog ─────────────────────────────────────────────────────
function StructureFormDialog ({ open, onOpenChange, editData, categories, classes, onSuccess }) {
  const [form, setForm] = useState({
    feeCategoryId: "", classId: "", amount: "", academicYear: "",
    dueDate: "", month: "", year: "",
  });
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (editData) {
      setForm({
        feeCategoryId: String(editData.feeCategoryId ?? ""),
        classId: String(editData.classId ?? ""),
        amount: String(editData.amount ?? ""),
        academicYear: editData.academicYear ?? "",
        dueDate: editData.dueDate ?? "",
        month: String(editData.month ?? ""),
        year: String(editData.year ?? ""),
      });
    } else {
      setForm({ feeCategoryId: "", classId: "", amount: "", academicYear: "", dueDate: "", month: "", year: "" });
    }
  }, [editData, open]);
  
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const handleSave = async () => {
    if (!form.feeCategoryId || !form.classId || !form.amount) {
      toast.error("Category, class and amount are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        feeCategoryId: Number(form.feeCategoryId),
        classId: Number(form.classId),
        amount: Number(form.amount),
        academicYear: form.academicYear || undefined,
        dueDate: form.dueDate || undefined,
        month: form.month ? Number(form.month) : undefined,
        year: form.year ? Number(form.year) : undefined,
      };
      editData
         ? await feeApi.updateStructure(editData.id, payload)
         : await feeApi.createStructure(payload);
      toast.success(editData ? "Structure updated" : "Structure created");
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
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>{editData ? "Edit Structure" : "Add Fee Structure"}</DialogTitle>
         </DialogHeader>
         <div className="grid grid-cols-2 gap-4 py-2">
           <F label="Category *">
             <Select value={form.feeCategoryId} onValueChange={(v) => set("feeCategoryId", v)}>
               <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
               <SelectContent>
                 {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           <F label="Class *">
             <Select value={form.classId} onValueChange={(v) => set("classId", v)}>
               <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
               <SelectContent>
                 {classes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           <F label="Amount (₹) *">
             <Input type="number" min="0" placeholder="5000"
                    value={form.amount} onChange={(e) => set("amount", e.target.value)}/>
           </F>
           <F label="Academic Year">
             <Input placeholder="2024-2025"
                    value={form.academicYear} onChange={(e) => set("academicYear", e.target.value)}/>
           </F>
           <F label="Due Date">
             <Input type="date" value={form.dueDate}
                    onChange={(e) => set("dueDate", e.target.value)}/>
           </F>
           <F label="Month">
             <Select value={form.month} onValueChange={(v) => set("month", v)}>
               <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
               <SelectContent>
                 {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
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

function TableSkeleton ({ cols = 5 }) {
  return (
     <div className="p-4 space-y-3">
       {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            {Array.from({ length: cols }).map((_, j) => (
               <Skeleton key={j} className="h-4 flex-1"/>
            ))}
          </div>
       ))}
     </div>
  );
}