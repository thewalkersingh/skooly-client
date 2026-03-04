import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus, Filter, Download, Eye,
  Pencil, Trash2, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import { studentApi } from "@/api/studentApi";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { getInitials, getFullName, formatDate } from "@/utils/formatters";
import { GENDER } from "@/utils/constants";
import useAuthStore from "@/store/authStore";

export default function StudentsPage () {
  const navigate = useNavigate();
  const { isAdmin, isTeacher } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  const debouncedSearch = useDebounce(search, 400);
  
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentApi.getAll({
        page,
        size,
        search: debouncedSearch || undefined,
        gender: gender || undefined,
        status: status || undefined,
      });
      setStudents(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [page, size, debouncedSearch, gender, status]);
  
  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  
  // Reset to page 1 when filters change
  useEffect(() => { reset(); }, [debouncedSearch, gender, status]);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentApi.delete(deleteId);
      toast.success("Student deleted successfully");
      setDeleteId(null);
      fetchStudents();
    } catch {
      toast.error("Failed to delete student");
    } finally {
      setDeleting(false);
    }
  };
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Students"
          subtitle={`${total} students total`}
          actions={
             isAdmin && (
                <Button
                   onClick={() => navigate("/students/new")}
                   className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2"/> Add Student
                </Button>
             )
          }
       />
       
       {/* ── Filters ─────────────────────────────────────────────── */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-3">
             <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search students..."
                className="flex-1 min-w-[200px]"
             />
             
             <Select value={gender} onValueChange={setGender}>
               <SelectTrigger className="w-36">
                 <SelectValue placeholder="Gender"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">All Genders</SelectItem>
                 <SelectItem value="MALE">Male</SelectItem>
                 <SelectItem value="FEMALE">Female</SelectItem>
                 <SelectItem value="OTHER">Other</SelectItem>
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
                 <SelectItem value="GRADUATED">Graduated</SelectItem>
                 <SelectItem value="SUSPENDED">Suspended</SelectItem>
               </SelectContent>
             </Select>
             
             {(search || gender || status) && (
                <Button
                   variant="outline"
                   onClick={() => {
                     setSearch("");
                     setGender("");
                     setStatus("");
                   }}
                >
                  Clear Filters
                </Button>
             )}
           </div>
         </CardContent>
       </Card>
       
       {/* ── Table ───────────────────────────────────────────────── */}
       <Card>
         <CardContent className="p-0">
           {loading ? (
              <TableSkeleton/>
           ) : students.length === 0 ? (
              <EmptyState
                 icon={Users}
                 title="No students found"
                 description={search ? `No results for "${search}"` : "Add your first student to get started."}
                 action={
                    isAdmin && (
                       <Button onClick={() => navigate("/students/new")}
                               className="bg-blue-600 hover:bg-blue-700">
                         <Plus className="w-4 h-4 mr-2"/> Add Student
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
                      <th className="text-left px-4 py-3 font-medium">Roll No</th>
                      <th className="text-left px-4 py-3 font-medium">Class</th>
                      <th className="text-left px-4 py-3 font-medium">Section</th>
                      <th className="text-left px-4 py-3 font-medium">Gender</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Joined</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {students.map((student) => (
                       <StudentRow
                          key={student.id}
                          student={student}
                          canEdit={isAdmin}
                          onView={() => navigate(`/students/${student.id}`)}
                          onEdit={() => navigate(`/students/${student.id}/edit`)}
                          onDelete={() => setDeleteId(student.id)}
                       />
                    ))}
                    </tbody>
                  </table>
                </div>
                
                <Pagination
                   page={page}
                   totalPages={totalPages}
                   total={total}
                   size={size}
                   onPageChange={setPage}
                />
              </>
           )}
         </CardContent>
       </Card>
       
       {/* ── Delete Confirm ──────────────────────────────────────── */}
       <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(o) => !o && setDeleteId(null)}
          title="Delete Student"
          description="Are you sure you want to delete this student? This action cannot be undone."
          confirmLabel="Delete"
          isLoading={deleting}
          onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Student Row ───────────────────────────────────────────────────────────────
function StudentRow ({ student, canEdit, onView, onEdit, onDelete }) {
  return (
     <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
       
       {/* Name + photo */}
       <td className="px-4 py-3">
         <div className="flex items-center gap-3">
           <Avatar className="w-9 h-9 shrink-0">
             <AvatarImage src={student.photo ? `/uploads/${student.photo}` : undefined}/>
             <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
               {getInitials(student.firstName, student.lastName)}
             </AvatarFallback>
           </Avatar>
           <div>
             <p className="font-medium text-gray-900 dark:text-white">
               {getFullName(student.firstName, student.lastName)}
             </p>
             <p className="text-xs text-muted-foreground">{student.email ?? "—"}</p>
           </div>
         </div>
       </td>
       
       <td className="px-4 py-3 text-muted-foreground">{student.rollNumber ?? "—"}</td>
       <td className="px-4 py-3">{student.className ?? "—"}</td>
       <td className="px-4 py-3">{student.sectionName ?? "—"}</td>
       <td className="px-4 py-3 text-muted-foreground">{student.gender ?? "—"}</td>
       <td className="px-4 py-3"><StatusBadge status={student.status}/></td>
       <td className="px-4 py-3 text-muted-foreground">{formatDate(student.createdAt)}</td>
       
       {/* Actions */}
       <td className="px-4 py-3">
         <div className="flex items-center justify-end gap-1">
           <button
              onClick={onView}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-blue-600"
              title="View"
           >
             <Eye className="w-4 h-4"/>
           </button>
           {canEdit && (
              <>
                <button
                   onClick={onEdit}
                   className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600"
                   title="Edit"
                >
                  <Pencil className="w-4 h-4"/>
                </button>
                <button
                   onClick={onDelete}
                   className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600"
                   title="Delete"
                >
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
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-4 w-16"/>
            <Skeleton className="h-4 w-16"/>
            <Skeleton className="h-6 w-16 rounded-full"/>
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-4 w-16"/>
          </div>
       ))}
     </div>
  );
}