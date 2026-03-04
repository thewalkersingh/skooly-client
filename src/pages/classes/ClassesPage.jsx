import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus, Eye, Pencil, Trash2,
  School, Users, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { classApi } from "@/api/classApi";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import useAuthStore from "@/store/authStore";

export default function ClassesPage () {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const { page, size, setPage, reset } = usePagination();
  
  const [classes, setClasses] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editClass, setEditClass] = useState(null);
  
  const debouncedSearch = useDebounce(search, 400);
  
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await classApi.getAll({
        page, size,
        search: debouncedSearch || undefined,
      });
      setClasses(res.data?.data ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch {
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  }, [page, size, debouncedSearch]);
  
  useEffect(() => { fetchClasses(); }, [fetchClasses]);
  useEffect(() => { reset(); }, [debouncedSearch]);
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await classApi.delete(deleteId);
      toast.success("Class deleted");
      setDeleteId(null);
      fetchClasses();
    } catch {
      toast.error("Failed to delete class");
    } finally {
      setDeleting(false);
    }
  };
  
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditClass(null);
    fetchClasses();
  };
  
  return (
     <div className="space-y-5">
       <PageHeader
          title="Classes"
          subtitle={`${total} classes total`}
          actions={
             isAdmin && (
                <Button onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2"/> Add Class
                </Button>
             )
          }
       />
       
       {/* Search */}
       <Card>
         <CardContent className="p-4">
           <div className="flex gap-3">
             <SearchBar
                value={search} onChange={setSearch}
                placeholder="Search classes..."
                className="flex-1"
             />
             {search && (
                <Button variant="outline" onClick={() => setSearch("")}>
                  Clear
                </Button>
             )}
           </div>
         </CardContent>
       </Card>
       
       {/* Classes Grid */}
       {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
               <Skeleton key={i} className="h-44 rounded-xl"/>
            ))}
          </div>
       ) : classes.length === 0 ? (
          <EmptyState
             icon={School}
             title="No classes found"
             description="Add your first class to get started."
             action={
                isAdmin && (
                   <Button onClick={() => setShowForm(true)}
                           className="bg-blue-600 hover:bg-blue-700">
                     <Plus className="w-4 h-4 mr-2"/> Add Class
                   </Button>
                )
             }
          />
       ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {classes.map((cls) => (
                 <ClassCard
                    key={cls.id}
                    cls={cls}
                    canEdit={isAdmin}
                    onView={() => navigate(`/classes/${cls.id}`)}
                    onEdit={() => {
                      setEditClass(cls);
                      setShowForm(true);
                    }}
                    onDelete={() => setDeleteId(cls.id)}
                 />
              ))}
            </div>
            <Pagination
               page={page} totalPages={totalPages}
               total={total} size={size}
               onPageChange={setPage}
            />
          </>
       )}
       
       {/* Class Form Dialog */}
       <ClassFormDialog
          open={showForm}
          onOpenChange={(o) => {
            setShowForm(o);
            if (!o) setEditClass(null);
          }}
          editData={editClass}
          onSuccess={handleFormSuccess}
       />
       
       <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(o) => !o && setDeleteId(null)}
          title="Delete Class"
          description="Deleting this class will also remove its sections. Are you sure?"
          confirmLabel="Delete"
          isLoading={deleting}
          onConfirm={handleDelete}
       />
     </div>
  );
}

// ── Class Card ────────────────────────────────────────────────────────────────
function ClassCard ({ cls, canEdit, onView, onEdit, onDelete }) {
  const colors = [
    "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30",
    "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30",
    "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30",
    "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30",
    "bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-900/30",
    "bg-teal-50 dark:bg-teal-900/20 border-teal-100 dark:border-teal-900/30",
  ];
  const color = colors[cls.id % colors.length];
  
  return (
     <Card className={`border ${color} hover:shadow-md transition-shadow cursor-pointer`}
           onClick={onView}>
       <CardContent className="p-5">
         <div className="flex items-start justify-between">
           <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
             <School className="w-6 h-6 text-blue-600"/>
           </div>
           {canEdit && (
              <div className="flex gap-1"
                   onClick={(e) => e.stopPropagation()}>
                <button onClick={onEdit}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                  <Pencil className="w-3.5 h-3.5"/>
                </button>
                <button onClick={onDelete}
                        className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
           )}
         </div>
         
         <div className="mt-4">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white">
             {cls.name}
           </h3>
           <p className="text-sm text-muted-foreground mt-0.5">
             Grade {cls.gradeLevel}
           </p>
         </div>
         
         <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
           <Users className="w-4 h-4"/>
           <span>{cls.sectionCount ?? 0} sections</span>
         </div>
       </CardContent>
     </Card>
  );
}

// ── Class Form Dialog ─────────────────────────────────────────────────────────
function ClassFormDialog ({ open, onOpenChange, editData, onSuccess }) {
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (editData) {
      setName(editData.name ?? "");
      setGradeLevel(String(editData.gradeLevel ?? ""));
    } else {
      setName("");
      setGradeLevel("");
    }
  }, [editData, open]);
  
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Class name is required");
      return;
    }
    if (!gradeLevel) {
      toast.error("Grade level is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { name: name.trim(), gradeLevel: Number(gradeLevel) };
      if (editData) {
        await classApi.update(editData.id, payload);
        toast.success("Class updated");
      } else {
        await classApi.create(payload);
        toast.success("Class created");
      }
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  };
  
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-sm">
         <DialogHeader>
           <DialogTitle>{editData ? "Edit Class" : "Add New Class"}</DialogTitle>
         </DialogHeader>
         
         <div className="space-y-4 py-2">
           <div className="space-y-1.5">
             <Label>Class Name *</Label>
             <Input placeholder="e.g. Class 10"
                    value={name} onChange={(e) => setName(e.target.value)}/>
           </div>
           <div className="space-y-1.5">
             <Label>Grade Level *</Label>
             <Input type="number" min="1" max="12"
                    placeholder="e.g. 10"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}/>
           </div>
         </div>
         
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>
             Cancel
           </Button>
           <Button onClick={handleSave}
                   className="bg-blue-600 hover:bg-blue-700"
                   disabled={saving}>
             {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {editData ? "Update" : "Create"}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}