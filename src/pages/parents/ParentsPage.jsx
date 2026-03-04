import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus, Eye, Pencil, Trash2, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { parentApi } from "@/api/parentApi";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { getInitials, getFullName, formatDate } from "@/utils/formatters";
import useAuthStore from "@/store/authStore";

export default function ParentsPage () {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [parents, setParents] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);
  
  const fetchParents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await parentApi.getAll({
        page, size,
        search: debouncedSearch || undefined,
        status: status || undefined,
      });
      setParents(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch { toast.error("Failed to fetch parents"); } finally { setLoading(false); }
  }, [page, size, debouncedSearch, status]);
  
  useEffect(() => { fetchParents(); }, [fetchParents]);
  useEffect(() => { reset(); }, [debouncedSearch, status]);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await parentApi.delete(deleteId);
      toast.success("Parent deleted");
      setDeleteId(null);
      fetchParents();
    } catch { toast.error("Failed to delete parent"); } finally { setDeleting(false); }
  };
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Parents"
          subtitle={`${total} parents registered`}
          actions={
             isAdmin && (
                <Button onClick={() => navigate("/parents/new")}
                        className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2"/> Add Parent
                </Button>
             )
          }
       />
       
       {/* Filters */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <SearchBar value={search} onChange={setSearch}
                        placeholder="Search parents..."
                        className="flex-1 min-w-[200px]"/>
             <Select value={status} onValueChange={setStatus}>
               <SelectTrigger className="w-36">
                 <SelectValue placeholder="Status"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Status</SelectItem>
                 <SelectItem value="ACTIVE">Active</SelectItem>
                 <SelectItem value="INACTIVE">Inactive</SelectItem>
               </SelectContent>
             </Select>
             {(search || status) && (
                <Button variant="outline"
                        onClick={() => {
                          setSearch("");
                          setStatus("");
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
              parents.length === 0 ? (
                 <EmptyState icon={Users} title="No parents found"
                             description="Add parents to link them with their children."
                             action={isAdmin && (
                                <Button onClick={() => navigate("/parents/new")}
                                        className="bg-blue-600 hover:bg-blue-700">
                                  <Plus className="w-4 h-4 mr-2"/> Add Parent
                                </Button>
                             )}
                 />
              ) : (
                 <>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                       <thead className="bg-gray-50 dark:bg-gray-800/50">
                       <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                         <th className="text-left px-4 py-3 font-medium">Parent</th>
                         <th className="text-left px-4 py-3 font-medium">Phone</th>
                         <th className="text-left px-4 py-3 font-medium">Occupation</th>
                         <th className="text-left px-4 py-3 font-medium">Children</th>
                         <th className="text-left px-4 py-3 font-medium">Status</th>
                         <th className="text-left px-4 py-3 font-medium">Joined</th>
                         <th className="text-right px-4 py-3 font-medium">Actions</th>
                       </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                       {parents.map((parent) => (
                          <ParentRow
                             key={parent.id}
                             parent={parent}
                             canEdit={isAdmin}
                             onView={() => navigate(`/parents/${parent.id}`)}
                             onEdit={() => navigate(`/parents/${parent.id}/edit`)}
                             onDelete={() => setDeleteId(parent.id)}
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
                      title="Delete Parent"
                      description="Are you sure you want to delete this parent? Their child links will also be removed."
                      confirmLabel="Delete" isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

function ParentRow ({ parent, canEdit, onView, onEdit, onDelete }) {
  return (
     <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
       <td className="px-4 py-3">
         <div className="flex items-center gap-3">
           <Avatar className="w-9 h-9 shrink-0">
             <AvatarImage
                src={parent.photo ? `/uploads/${parent.photo}` : undefined}
             />
             <AvatarFallback className="bg-teal-100 text-teal-700 text-xs font-semibold">
               {getInitials(parent.firstName, parent.lastName)}
             </AvatarFallback>
           </Avatar>
           <div>
             <p className="font-medium text-gray-900 dark:text-white">
               {getFullName(parent.firstName, parent.lastName)}
             </p>
             <p className="text-xs text-muted-foreground">{parent.email ?? "—"}</p>
           </div>
         </div>
       </td>
       <td className="px-4 py-3 text-muted-foreground">{parent.phone ?? "—"}</td>
       <td className="px-4 py-3 text-muted-foreground">{parent.occupation ?? "—"}</td>
       <td className="px-4 py-3">
         {parent.childrenCount > 0 ? (
            <Badge variant="secondary" className="text-xs">
              {parent.childrenCount} {parent.childrenCount === 1 ? "child" : "children"}
            </Badge>
         ) : (
            <span className="text-xs text-muted-foreground">None linked</span>
         )}
       </td>
       <td className="px-4 py-3"><StatusBadge status={parent.status}/></td>
       <td className="px-4 py-3 text-muted-foreground">
         {formatDate(parent.createdAt)}
       </td>
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

function TableSkeleton () {
  return (
     <div className="p-4 space-y-3">
       {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-9 h-9 rounded-full shrink-0"/>
            <Skeleton className="h-4 flex-1"/>
            <Skeleton className="h-4 w-24"/>
            <Skeleton className="h-4 w-24"/>
            <Skeleton className="h-6 w-20 rounded-full"/>
            <Skeleton className="h-6 w-16 rounded-full"/>
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-4 w-16"/>
          </div>
       ))}
     </div>
  );
}