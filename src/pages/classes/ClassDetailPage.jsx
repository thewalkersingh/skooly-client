import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2,
  Users, UserCheck, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/layout/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { classApi } from "@/api/classApi";
import { teacherApi } from "@/api/teacherApi";
import { getInitials, getFullName } from "@/utils/formatters";
import useAuthStore from "@/store/authStore";

export default function ClassDetailPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  
  const [cls, setCls] = useState(null);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => { fetchData(); }, [id]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [clsRes, secRes, tchRes] = await Promise.all([
        classApi.getById(id),
        classApi.getSections(id),
        teacherApi.getAll({ page: 1, size: 100, status: "ACTIVE" }),
      ]);
      setCls(clsRes.data);
      setSections(secRes.data ?? []);
      setTeachers(tchRes.data?.data ?? []);
    } catch {
      toast.error("Failed to load class");
      navigate("/classes");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteSection = async () => {
    setDeleting(true);
    try {
      await classApi.deleteSection(deleteId);
      toast.success("Section deleted");
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete section");
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading) return (
     <div className="space-y-5">
       <Skeleton className="h-10 w-48"/>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36"/>)}
       </div>
     </div>
  );
  
  return (
     <div className="space-y-5">
       <PageHeader
          title={cls?.name}
          subtitle={`Grade ${cls?.gradeLevel} • ${sections.length} sections`}
          backTo="/classes"
          breadcrumbs={[
            { label: "Classes", path: "/classes" },
            { label: cls?.name },
          ]}
          actions={
             isAdmin && (
                <div className="flex gap-2">
                  <Button onClick={() => navigate("/timetable")}
                          variant="outline">
                    View Timetable
                  </Button>
                  <Button onClick={() => setShowForm(true)}
                          className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2"/> Add Section
                  </Button>
                </div>
             )
          }
       />
       
       {/* Sections Grid */}
       {sections.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3"/>
              <p className="font-medium text-gray-900 dark:text-white">No sections yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add sections to this class to get started.
              </p>
              {isAdmin && (
                 <Button className="mt-4 bg-blue-600 hover:bg-blue-700"
                         onClick={() => setShowForm(true)}>
                   <Plus className="w-4 h-4 mr-2"/> Add Section
                 </Button>
              )}
            </CardContent>
          </Card>
       ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
               <SectionCard
                  key={section.id}
                  section={section}
                  canEdit={isAdmin}
                  onEdit={() => {
                    setEditSection(section);
                    setShowForm(true);
                  }}
                  onDelete={() => setDeleteId(section.id)}
               />
            ))}
          </div>
       )}
       
       {/* Section Form Dialog */}
       <SectionFormDialog
          open={showForm}
          onOpenChange={(o) => {
            setShowForm(o);
            if (!o) setEditSection(null);
          }}
          editData={editSection}
          classId={id}
          teachers={teachers}
          onSuccess={() => {
            setShowForm(false);
            setEditSection(null);
            fetchData();
          }}
       />
       
       <ConfirmDialog
          open={!!deleteId}
          onOpenChange={(o) => !o && setDeleteId(null)}
          title="Delete Section"
          description="Are you sure you want to delete this section?"
          confirmLabel="Delete"
          isLoading={deleting}
          onConfirm={handleDeleteSection}
       />
     </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard ({ section, canEdit, onEdit, onDelete }) {
  return (
     <Card className="hover:shadow-md transition-shadow">
       <CardContent className="p-5">
         <div className="flex items-start justify-between">
           <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20">
             <span className="text-xl font-bold text-blue-600">{section.name}</span>
           </div>
           {canEdit && (
              <div className="flex gap-1">
                <button onClick={onEdit}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-green-600">
                  <Pencil className="w-4 h-4"/>
                </button>
                <button onClick={onDelete}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-red-600">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
           )}
         </div>
         
         <div className="mt-4 space-y-2">
           <p className="font-semibold text-gray-900 dark:text-white">
             Section {section.name}
           </p>
           {section.teacherName ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                    {getInitials(section.teacherName, "")}
                  </AvatarFallback>
                </Avatar>
                <span>{section.teacherName}</span>
              </div>
           ) : (
              <p className="text-sm text-muted-foreground">No teacher assigned</p>
           )}
         </div>
       </CardContent>
     </Card>
  );
}

// ── Section Form Dialog ───────────────────────────────────────────────────────
function SectionFormDialog ({ open, onOpenChange, editData, classId, teachers, onSuccess }) {
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (editData) {
      setName(editData.name ?? "");
      setTeacherId(editData.teacherId ? String(editData.teacherId) : "");
    } else {
      setName("");
      setTeacherId("");
    }
  }, [editData, open]);
  
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Section name is required");
      return;
    }
    setSaving(true);
    try {
      if (editData) {
        await classApi.updateSection(editData.id, {
          name: name.trim(),
          classId: Number(classId),
        });
        if (teacherId) {
          await classApi.assignTeacher(editData.id, teacherId);
        }
        toast.success("Section updated");
      } else {
        const res = await classApi.createSection({
          name: name.trim(),
          classId: Number(classId),
          teacherId: teacherId ? Number(teacherId) : undefined,
        });
        toast.success("Section created");
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
           <DialogTitle>{editData ? "Edit Section" : "Add New Section"}</DialogTitle>
         </DialogHeader>
         <div className="space-y-4 py-2">
           <div className="space-y-1.5">
             <Label>Section Name *</Label>
             <Input placeholder="e.g. A"
                    value={name} onChange={(e) => setName(e.target.value)}/>
           </div>
           <div className="space-y-1.5">
             <Label>Class Teacher (optional)</Label>
             <Select value={teacherId} onValueChange={setTeacherId}>
               <SelectTrigger>
                 <SelectValue placeholder="Assign a teacher"/>
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="">None</SelectItem>
                 {teachers.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {getFullName(t.firstName, t.lastName)}
                    </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </div>
         <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
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