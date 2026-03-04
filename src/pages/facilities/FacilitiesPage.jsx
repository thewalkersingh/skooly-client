import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Wrench,
  Building, Package, Loader2,
  AlertTriangle, CheckCircle, Clock,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { facilityApi } from "@/api/facilityApi";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { formatDate, formatCurrency } from "@/utils/formatters";
import useAuthStore from "@/store/authStore";

export default function FacilitiesPage () {
  return (
     <div className="space-y-5">
       <PageHeader
          title="Facilities"
          subtitle="Manage rooms, maintenance and inventory"
       />
       <Tabs defaultValue="rooms">
         <TabsList>
           <TabsTrigger value="rooms">
             <Building className="w-4 h-4 mr-1.5"/> Rooms
           </TabsTrigger>
           <TabsTrigger value="maintenance">
             <Wrench className="w-4 h-4 mr-1.5"/> Maintenance
           </TabsTrigger>
           <TabsTrigger value="inventory">
             <Package className="w-4 h-4 mr-1.5"/> Inventory
           </TabsTrigger>
         </TabsList>
         <TabsContent value="rooms"> <RoomsTab/> </TabsContent>
         <TabsContent value="maintenance"> <MaintenanceTab/> </TabsContent>
         <TabsContent value="inventory"> <InventoryTab/> </TabsContent>
       </Tabs>
     </div>
  );
}

// ── Rooms Tab ─────────────────────────────────────────────────────────────────
function RoomsTab () {
  const { isAdmin } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [rooms, setRooms] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);
  
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await facilityApi.getRooms({
        page, size,
        search: debouncedSearch || undefined,
        type: type || undefined,
        status: status || undefined,
      });
      setRooms(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch rooms"); } finally { setLoading(false); }
  }, [page, size, debouncedSearch, type, status]);
  
  useEffect(() => { fetchRooms(); }, [fetchRooms]);
  useEffect(() => { reset(); }, [debouncedSearch, type, status]);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await facilityApi.deleteRoom(deleteId);
      toast.success("Room deleted");
      setDeleteId(null);
      fetchRooms();
    } catch { toast.error("Failed to delete room"); } finally { setDeleting(false); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       {/* Filters */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <SearchBar value={search} onChange={setSearch}
                        placeholder="Search rooms..." className="flex-1 min-w-[180px]"/>
             
             <Select value={type} onValueChange={setType}>
               <SelectTrigger className="w-40">
                 <SelectValue placeholder="Room Type"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Types</SelectItem>
                 {["CLASSROOM", "LABORATORY", "LIBRARY", "AUDITORIUM",
                   "OFFICE", "STAFFROOM", "GYM", "CANTEEN", "OTHER"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             
             <Select value={status} onValueChange={setStatus}>
               <SelectTrigger className="w-36">
                 <SelectValue placeholder="Status"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Status</SelectItem>
                 <SelectItem value="AVAILABLE">Available</SelectItem>
                 <SelectItem value="OCCUPIED">Occupied</SelectItem>
                 <SelectItem value="UNDER_MAINTENANCE">Under Maintenance</SelectItem>
               </SelectContent>
             </Select>
             
             {isAdmin && (
                <Button onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2"/> Add Room
                </Button>
             )}
             {(search || type || status) && (
                <Button variant="outline"
                        onClick={() => {
                          setSearch("");
                          setType("");
                          setStatus("");
                        }}>
                  Clear
                </Button>
             )}
           </div>
         </CardContent>
       </Card>
       
       {/* Rooms Grid */}
       {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
               <Skeleton key={i} className="h-44 rounded-xl"/>
            ))}
          </div>
       ) : rooms.length === 0 ? (
          <EmptyState icon={Building} title="No rooms found"
                      description="Add rooms to get started."
                      action={isAdmin && (
                         <Button onClick={() => setShowForm(true)}
                                 className="bg-blue-600 hover:bg-blue-700">
                           <Plus className="w-4 h-4 mr-2"/> Add Room
                         </Button>
                      )}
          />
       ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rooms.map((room) => (
                 <RoomCard
                    key={room.id}
                    room={room}
                    canEdit={isAdmin}
                    onEdit={() => {
                      setEditRoom(room);
                      setShowForm(true);
                    }}
                    onDelete={() => setDeleteId(room.id)}
                 />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages}
                        total={total} size={size} onPageChange={setPage}/>
          </>
       )}
       
       <RoomFormDialog
          open={showForm}
          onOpenChange={(o) => {
            setShowForm(o);
            if (!o) setEditRoom(null);
          }}
          editData={editRoom}
          onSuccess={() => {
            setShowForm(false);
            setEditRoom(null);
            fetchRooms();
          }}
       />
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Room"
                      description="Are you sure you want to delete this room?"
                      confirmLabel="Delete" isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Room Card ─────────────────────────────────────────────────────────────────
function RoomCard ({ room, canEdit, onEdit, onDelete }) {
  const statusColor = {
    AVAILABLE: "bg-green-100 text-green-700",
    OCCUPIED: "bg-blue-100 text-blue-700",
    UNDER_MAINTENANCE: "bg-yellow-100 text-yellow-700",
  };
  
  const typeIcon = {
    CLASSROOM: "🏫", LABORATORY: "🔬", LIBRARY: "📚",
    AUDITORIUM: "🎭", OFFICE: "🏢", STAFFROOM: "👥",
    GYM: "💪", CANTEEN: "🍽️", OTHER: "🏠",
  };
  
  return (
     <Card className="hover:shadow-md transition-shadow">
       <CardContent className="p-5">
         <div className="flex items-start justify-between mb-3">
           <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-2xl">
             {typeIcon[room.type] ?? "🏠"}
           </div>
           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[room.status] ?? "bg-gray-100 text-gray-700"}`}>
            {room.status?.replace(/_/g, " ")}
          </span>
         </div>
         
         <h3 className="font-semibold text-gray-900 dark:text-white">
           {room.name}
         </h3>
         <p className="text-xs text-muted-foreground mt-0.5">
           {room.type?.replace(/_/g, " ")}
         </p>
         
         <div className="flex items-center justify-between mt-3 pt-3 border-t">
           <div className="text-xs text-muted-foreground">
             Capacity: <span className="font-medium text-gray-900 dark:text-white">
              {room.capacity ?? "—"}
            </span>
           </div>
           {canEdit && (
              <div className="flex gap-1">
                <button onClick={onEdit}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                  <Pencil className="w-3.5 h-3.5"/>
                </button>
                <button onClick={onDelete}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
           )}
         </div>
       </CardContent>
     </Card>
  );
}

// ── Maintenance Tab ───────────────────────────────────────────────────────────
function MaintenanceTab () {
  const { isAdmin, isStaff } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [issues, setIssues] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editIssue, setEditIssue] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(null);
  
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await facilityApi.getMaintenance({
        page, size,
        status: status || undefined,
        priority: priority || undefined,
      });
      setIssues(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch maintenance issues"); } finally { setLoading(false); }
  }, [page, size, status, priority]);
  
  useEffect(() => { fetchIssues(); }, [fetchIssues]);
  useEffect(() => { reset(); }, [status, priority]);
  
  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await facilityApi.updateMaintenanceStatus(id, newStatus);
      toast.success("Status updated");
      fetchIssues();
    } catch { toast.error("Failed to update status"); } finally { setUpdating(null); }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await facilityApi.deleteMaintenance(deleteId);
      toast.success("Issue deleted");
      setDeleteId(null);
      fetchIssues();
    } catch { toast.error("Failed to delete issue"); } finally { setDeleting(false); }
  };
  
  const priorityColor = {
    LOW: "bg-gray-100   text-gray-600",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100    text-red-700",
  };
  
  return (
     <div className="space-y-4 mt-4">
       <div className="flex flex-wrap gap-3">
         <Select value={status} onValueChange={setStatus}>
           <SelectTrigger className="w-44">
             <SelectValue placeholder="All Status"/>
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="">All Status</SelectItem>
             <SelectItem value="OPEN">Open</SelectItem>
             <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
             <SelectItem value="RESOLVED">Resolved</SelectItem>
             <SelectItem value="CLOSED">Closed</SelectItem>
           </SelectContent>
         </Select>
         
         <Select value={priority} onValueChange={setPriority}>
           <SelectTrigger className="w-36">
             <SelectValue placeholder="Priority"/>
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="">All Priority</SelectItem>
             <SelectItem value="LOW">Low</SelectItem>
             <SelectItem value="MEDIUM">Medium</SelectItem>
             <SelectItem value="HIGH">High</SelectItem>
             <SelectItem value="CRITICAL">Critical</SelectItem>
           </SelectContent>
         </Select>
         
         <Button onClick={() => setShowForm(true)}
                 className="bg-blue-600 hover:bg-blue-700 ml-auto">
           <Plus className="w-4 h-4 mr-2"/> Report Issue
         </Button>
         
         {(status || priority) && (
            <Button variant="outline"
                    onClick={() => {
                      setStatus("");
                      setPriority("");
                    }}>
              Clear
            </Button>
         )}
       </div>
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={6}/> :
              issues.length === 0 ? (
                 <EmptyState icon={Wrench} title="No maintenance issues"
                             description="All facilities are running smoothly."
                             action={
                               <Button onClick={() => setShowForm(true)}
                                       className="bg-blue-600 hover:bg-blue-700">
                                 <Plus className="w-4 h-4 mr-2"/> Report Issue
                               </Button>
                             }
                 />
              ) : (
                 <>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-gray-50 dark:bg-gray-800/50">
                       <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                         <th className="text-left px-4 py-3 font-medium">Facility</th>
                         <th className="text-left px-4 py-3 font-medium">Issue</th>
                         <th className="text-left px-4 py-3 font-medium">Priority</th>
                         <th className="text-left px-4 py-3 font-medium">Reported</th>
                         <th className="text-left px-4 py-3 font-medium">Status</th>
                         <th className="text-right px-4 py-3 font-medium">Actions</th>
                       </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {issues.map((issue) => (
                          <tr key={issue.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-4 py-3 font-medium">
                              {issue.roomName ?? issue.facilityName ?? "—"}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground max-w-xs">
                              <p className="truncate">{issue.description}</p>
                            </td>
                            <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor[issue.priority] ?? "bg-gray-100 text-gray-700"}`}>
                            {issue.priority}
                          </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {formatDate(issue.reportedDate ?? issue.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                              <Select
                                 value={issue.status}
                                 onValueChange={(v) => handleStatusChange(issue.id, v)}
                                 disabled={updating === issue.id}
                              >
                                <SelectTrigger className="h-7 w-36 text-xs">
                                  <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OPEN">Open</SelectItem>
                                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                                  <SelectItem value="CLOSED">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                   onClick={() => {
                                     setEditIssue(issue);
                                     setShowForm(true);
                                   }}
                                   className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                                  <Pencil className="w-4 h-4"/>
                                </button>
                                {isAdmin && (
                                   <button onClick={() => setDeleteId(issue.id)}
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
       
       <MaintenanceFormDialog
          open={showForm}
          onOpenChange={(o) => {
            setShowForm(o);
            if (!o) setEditIssue(null);
          }}
          editData={editIssue}
          onSuccess={() => {
            setShowForm(false);
            setEditIssue(null);
            fetchIssues();
          }}
       />
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Maintenance Issue"
                      description="Delete this maintenance issue?"
                      confirmLabel="Delete" isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Inventory Tab ─────────────────────────────────────────────────────────────
function InventoryTab () {
  const { isAdmin } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);
  
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await facilityApi.getInventory({
        page, size,
        search: debouncedSearch || undefined,
        category: category || undefined,
      });
      setItems(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch inventory"); } finally { setLoading(false); }
  }, [page, size, debouncedSearch, category]);
  
  useEffect(() => { fetchInventory(); }, [fetchInventory]);
  useEffect(() => { reset(); }, [debouncedSearch, category]);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await facilityApi.deleteInventory(deleteId);
      toast.success("Item deleted");
      setDeleteId(null);
      fetchInventory();
    } catch { toast.error("Failed to delete item"); } finally { setDeleting(false); }
  };
  
  return (
     <div className="space-y-4 mt-4">
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <SearchBar value={search} onChange={setSearch}
                        placeholder="Search inventory..." className="flex-1 min-w-[180px]"/>
             
             <Select value={category} onValueChange={setCategory}>
               <SelectTrigger className="w-44">
                 <SelectValue placeholder="Category"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Categories</SelectItem>
                 {["FURNITURE", "ELECTRONICS", "SPORTS", "STATIONERY",
                   "CLEANING", "LABORATORY", "KITCHEN", "OTHER"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.replace(/_/g, " ")}
                    </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             
             {isAdmin && (
                <Button onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2"/> Add Item
                </Button>
             )}
             {(search || category) && (
                <Button variant="outline"
                        onClick={() => {
                          setSearch("");
                          setCategory("");
                        }}>
                  Clear
                </Button>
             )}
           </div>
         </CardContent>
       </Card>
       
       <Card>
         <CardContent className="p-0">
           {loading ? <TableSkeleton cols={6}/> :
              items.length === 0 ? (
                 <EmptyState icon={Package} title="No inventory items"
                             description="Add items to track your inventory."
                             action={isAdmin && (
                                <Button onClick={() => setShowForm(true)}
                                        className="bg-blue-600 hover:bg-blue-700">
                                  <Plus className="w-4 h-4 mr-2"/> Add Item
                                </Button>
                             )}
                 />
              ) : (
                 <>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-gray-50 dark:bg-gray-800/50">
                       <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                         <th className="text-left px-4 py-3 font-medium">Item</th>
                         <th className="text-left px-4 py-3 font-medium">Category</th>
                         <th className="text-left px-4 py-3 font-medium">Quantity</th>
                         <th className="text-left px-4 py-3 font-medium">Unit Price</th>
                         <th className="text-left px-4 py-3 font-medium">Total Value</th>
                         <th className="text-left px-4 py-3 font-medium">Condition</th>
                         {isAdmin && <th className="text-right px-4 py-3 font-medium">Actions</th>}
                       </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {items.map((item) => (
                          <tr key={item.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-4 py-3">
                              <p className="font-medium">{item.name}</p>
                              {item.description && (
                                 <p className="text-xs text-muted-foreground truncate max-w-xs">
                                   {item.description}
                                 </p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs">
                                {item.category?.replace(/_/g, " ")}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                          <span className={`font-medium ${
                             item.quantity <= (item.minimumQuantity ?? 5)
                                ? "text-red-600" : "text-gray-900 dark:text-white"
                          }`}>
                            {item.quantity}
                          </span>
                              {item.quantity <= (item.minimumQuantity ?? 5) && (
                                 <span className="ml-1.5 text-xs text-red-500">Low stock</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {item.unitPrice ? formatCurrency(item.unitPrice) : "—"}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {item.unitPrice
                                 ? formatCurrency(item.unitPrice * item.quantity)
                                 : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <ConditionBadge condition={item.condition}/>
                            </td>
                            {isAdmin && (
                               <td className="px-4 py-3">
                                 <div className="flex items-center justify-end gap-1">
                                   <button
                                      onClick={() => {
                                        setEditItem(item);
                                        setShowForm(true);
                                      }}
                                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                                     <Pencil className="w-4 h-4"/>
                                   </button>
                                   <button onClick={() => setDeleteId(item.id)}
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
                   </div>
                   <Pagination page={page} totalPages={totalPages}
                               total={total} size={size} onPageChange={setPage}/>
                 </>
              )}
         </CardContent>
       </Card>
       
       <InventoryFormDialog
          open={showForm}
          onOpenChange={(o) => {
            setShowForm(o);
            if (!o) setEditItem(null);
          }}
          editData={editItem}
          onSuccess={() => {
            setShowForm(false);
            setEditItem(null);
            fetchInventory();
          }}
       />
       
       <ConfirmDialog open={!!deleteId}
                      onOpenChange={(o) => !o && setDeleteId(null)}
                      title="Delete Inventory Item"
                      description="Delete this inventory item?"
                      confirmLabel="Delete" isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

function ConditionBadge ({ condition }) {
  const colors = {
    NEW: "bg-green-100  text-green-700",
    GOOD: "bg-blue-100   text-blue-700",
    FAIR: "bg-yellow-100 text-yellow-700",
    POOR: "bg-orange-100 text-orange-700",
    DAMAGED: "bg-red-100    text-red-700",
  };
  return (
     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[condition] ?? "bg-gray-100 text-gray-700"}`}>
      {condition ?? "—"}
    </span>
  );
}

// ── Room Form Dialog ──────────────────────────────────────────────────────────
function RoomFormDialog ({ open, onOpenChange, editData, onSuccess }) {
  const [form, setForm] = useState({
    name: "", type: "", capacity: "", floor: "", building: "", description: "",
  });
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    setForm(editData ? {
      name: editData.name ?? "",
      type: editData.type ?? "",
      capacity: String(editData.capacity ?? ""),
      floor: String(editData.floor ?? ""),
      building: editData.building ?? "",
      description: editData.description ?? "",
    } : { name: "", type: "", capacity: "", floor: "", building: "", description: "" });
  }, [editData, open]);
  
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handle = (k) => (e) => set(k, e.target.value);
  
  const handleSave = async () => {
    if (!form.name || !form.type) {
      toast.error("Name and type are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        type: form.type,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        floor: form.floor ? Number(form.floor) : undefined,
        building: form.building || undefined,
        description: form.description || undefined,
      };
      editData
         ? await facilityApi.updateRoom(editData.id, payload)
         : await facilityApi.createRoom(payload);
      toast.success(editData ? "Room updated" : "Room added");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };
  
  const F = ({ label, children, className = "" }) => (
     <div className={`space-y-1.5 ${className}`}>
       <Label className="text-xs">{label}</Label>
       {children}
     </div>
  );
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>{editData ? "Edit Room" : "Add Room"}</DialogTitle>
         </DialogHeader>
         <div className="grid grid-cols-2 gap-4 py-2">
           <F label="Room Name *">
             <Input placeholder="e.g. Room 101"
                    value={form.name} onChange={handle("name")}/>
           </F>
           <F label="Type *">
             <Select value={form.type} onValueChange={(v) => set("type", v)}>
               <SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger>
               <SelectContent>
                 {["CLASSROOM", "LABORATORY", "LIBRARY", "AUDITORIUM",
                   "OFFICE", "STAFFROOM", "GYM", "CANTEEN", "OTHER"].map((t) => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           <F label="Capacity">
             <Input type="number" min="1" placeholder="40"
                    value={form.capacity} onChange={handle("capacity")}/>
           </F>
           <F label="Floor">
             <Input type="number" min="0" placeholder="1"
                    value={form.floor} onChange={handle("floor")}/>
           </F>
           <F label="Building" className="col-span-2">
             <Input placeholder="e.g. Main Block"
                    value={form.building} onChange={handle("building")}/>
           </F>
           <F label="Description" className="col-span-2">
             <Textarea placeholder="Optional notes..." rows={2}
                       value={form.description} onChange={handle("description")}/>
           </F>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={saving}
                   className="bg-blue-600 hover:bg-blue-700">
             {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {editData ? "Update" : "Add Room"}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}

// ── Maintenance Form Dialog ───────────────────────────────────────────────────
function MaintenanceFormDialog ({ open, onOpenChange, editData, onSuccess }) {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    roomId: "", description: "", priority: "", reportedDate: "",
    resolvedDate: "", cost: "", notes: "",
  });
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    facilityApi.getRooms({ page: 1, size: 100 })
       .then((res) => setRooms(res.data?.data ?? []));
  }, []);
  
  useEffect(() => {
    setForm(editData ? {
      roomId: String(editData.roomId ?? ""),
      description: editData.description ?? "",
      priority: editData.priority ?? "",
      reportedDate: editData.reportedDate ?? editData.createdAt?.split("T")[0] ?? "",
      resolvedDate: editData.resolvedDate ?? "",
      cost: String(editData.cost ?? ""),
      notes: editData.notes ?? "",
    } : {
      roomId: "", description: "", priority: "", reportedDate: "",
      resolvedDate: "", cost: "", notes: "",
    });
  }, [editData, open]);
  
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handle = (k) => (e) => set(k, e.target.value);
  
  const handleSave = async () => {
    if (!form.description || !form.priority) {
      toast.error("Description and priority are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        roomId: form.roomId ? Number(form.roomId) : undefined,
        description: form.description,
        priority: form.priority,
        reportedDate: form.reportedDate || undefined,
        resolvedDate: form.resolvedDate || undefined,
        cost: form.cost ? Number(form.cost) : undefined,
        notes: form.notes || undefined,
      };
      editData
         ? await facilityApi.updateMaintenance(editData.id, payload)
         : await facilityApi.createMaintenance(payload);
      toast.success(editData ? "Issue updated" : "Issue reported");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };
  
  const F = ({ label, children, className = "" }) => (
     <div className={`space-y-1.5 ${className}`}>
       <Label className="text-xs">{label}</Label>
       {children}
     </div>
  );
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>
             {editData ? "Edit Maintenance Issue" : "Report Maintenance Issue"}
           </DialogTitle>
         </DialogHeader>
         <div className="grid grid-cols-2 gap-4 py-2">
           <F label="Room (optional)" className="col-span-2">
             <Select value={form.roomId} onValueChange={(v) => set("roomId", v)}>
               <SelectTrigger><SelectValue placeholder="Select room"/></SelectTrigger>
               <SelectContent>
                 <SelectItem value="">No specific room</SelectItem>
                 {rooms.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           
           <F label="Priority *">
             <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
               <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
               <SelectContent>
                 <SelectItem value="LOW">Low</SelectItem>
                 <SelectItem value="MEDIUM">Medium</SelectItem>
                 <SelectItem value="HIGH">High</SelectItem>
                 <SelectItem value="CRITICAL">Critical</SelectItem>
               </SelectContent>
             </Select>
           </F>
           
           <F label="Reported Date">
             <Input type="date" value={form.reportedDate} onChange={handle("reportedDate")}/>
           </F>
           
           <F label="Description *" className="col-span-2">
             <Textarea placeholder="Describe the issue..."
                       rows={3} value={form.description} onChange={handle("description")}/>
           </F>
           
           <F label="Estimated Cost (₹)">
             <Input type="number" min="0" placeholder="5000"
                    value={form.cost} onChange={handle("cost")}/>
           </F>
           
           <F label="Resolved Date">
             <Input type="date" value={form.resolvedDate} onChange={handle("resolvedDate")}/>
           </F>
           
           <F label="Notes" className="col-span-2">
             <Textarea placeholder="Additional notes..." rows={2}
                       value={form.notes} onChange={handle("notes")}/>
           </F>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={saving}
                   className="bg-blue-600 hover:bg-blue-700">
             {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {editData ? "Update" : "Report"}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}

// ── Inventory Form Dialog ─────────────────────────────────────────────────────
function InventoryFormDialog ({ open, onOpenChange, editData, onSuccess }) {
  const [form, setForm] = useState({
    name: "", category: "", quantity: "", unitPrice: "",
    condition: "", minimumQuantity: "", description: "",
  });
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    setForm(editData ? {
      name: editData.name ?? "",
      category: editData.category ?? "",
      quantity: String(editData.quantity ?? ""),
      unitPrice: String(editData.unitPrice ?? ""),
      condition: editData.condition ?? "",
      minimumQuantity: String(editData.minimumQuantity ?? ""),
      description: editData.description ?? "",
    } : {
      name: "", category: "", quantity: "", unitPrice: "",
      condition: "", minimumQuantity: "", description: "",
    });
  }, [editData, open]);
  
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handle = (k) => (e) => set(k, e.target.value);
  
  const handleSave = async () => {
    if (!form.name || !form.category || !form.quantity) {
      toast.error("Name, category and quantity are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        quantity: Number(form.quantity),
        unitPrice: form.unitPrice ? Number(form.unitPrice) : undefined,
        condition: form.condition || undefined,
        minimumQuantity: form.minimumQuantity ? Number(form.minimumQuantity) : undefined,
        description: form.description || undefined,
      };
      editData
         ? await facilityApi.updateInventory(editData.id, payload)
         : await facilityApi.createInventory(payload);
      toast.success(editData ? "Item updated" : "Item added");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally { setSaving(false); }
  };
  
  const F = ({ label, children, className = "" }) => (
     <div className={`space-y-1.5 ${className}`}>
       <Label className="text-xs">{label}</Label>
       {children}
     </div>
  );
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>{editData ? "Edit Item" : "Add Inventory Item"}</DialogTitle>
         </DialogHeader>
         <div className="grid grid-cols-2 gap-4 py-2">
           <F label="Item Name *" className="col-span-2">
             <Input placeholder="e.g. Whiteboard Markers"
                    value={form.name} onChange={handle("name")}/>
           </F>
           
           <F label="Category *">
             <Select value={form.category} onValueChange={(v) => set("category", v)}>
               <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
               <SelectContent>
                 {["FURNITURE", "ELECTRONICS", "SPORTS", "STATIONERY",
                   "CLEANING", "LABORATORY", "KITCHEN", "OTHER"].map((c) => (
                    <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           
           <F label="Condition">
             <Select value={form.condition} onValueChange={(v) => set("condition", v)}>
               <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
               <SelectContent>
                 {["NEW", "GOOD", "FAIR", "POOR", "DAMAGED"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </F>
           
           <F label="Quantity *">
             <Input type="number" min="0" placeholder="10"
                    value={form.quantity} onChange={handle("quantity")}/>
           </F>
           
           <F label="Min. Quantity">
             <Input type="number" min="0" placeholder="5"
                    value={form.minimumQuantity} onChange={handle("minimumQuantity")}/>
           </F>
           
           <F label="Unit Price (₹)">
             <Input type="number" min="0" placeholder="50"
                    value={form.unitPrice} onChange={handle("unitPrice")}/>
           </F>
           
           <F label="Description" className="col-span-2">
             <Textarea placeholder="Optional description..." rows={2}
                       value={form.description} onChange={handle("description")}/>
           </F>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
           <Button onClick={handleSave} disabled={saving}
                   className="bg-blue-600 hover:bg-blue-700">
             {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {editData ? "Update" : "Add Item"}
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