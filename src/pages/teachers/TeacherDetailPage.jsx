import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Pencil, Trash2, Camera, User,
  Phone, Mail, MapPin, Calendar,
  BookOpen, Award, Hash, Plus, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { teacherApi } from "@/api/teacherApi";
import { subjectApi } from "@/api/subjectApi";
import { getInitials, getFullName, formatDate } from "@/utils/formatters";
import useAuthStore from "@/store/authStore";

export default function TeacherDetailPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  
  const [teacher, setTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDel, setShowDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addingSubjectId, setAddingSubjectId] = useState("");
  const [allSubjects, setAllSubjects] = useState([]);
  
  useEffect(() => { fetchTeacher(); }, [id]);
  
  useEffect(() => {
    subjectApi.getAll({ page: 1, size: 100 })
       .then((res) => setAllSubjects(res.data?.data ?? []))
       .catch(() => {});
  }, []);
  
  const fetchTeacher = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getById(id);
      setTeacher(res.data);
      setSubjects(res.data?.subjects ?? []);
    } catch {
      toast.error("Failed to load teacher");
      navigate("/teachers");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await teacherApi.delete(id);
      toast.success("Teacher deleted");
      navigate("/teachers");
    } catch {
      toast.error("Failed to delete teacher");
      setDeleting(false);
    }
  };
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await teacherApi.uploadPhoto(id, file);
      setTeacher(res.data);
      toast.success("Photo updated");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };
  
  const handleAssignSubject = async () => {
    if (!addingSubjectId) return;
    try {
      await teacherApi.assignSubject(id, addingSubjectId);
      toast.success("Subject assigned");
      setAddingSubjectId("");
      fetchTeacher();
    } catch {
      toast.error("Failed to assign subject");
    }
  };
  
  const handleRemoveSubject = async (subjectId) => {
    try {
      await teacherApi.removeSubject(id, subjectId);
      toast.success("Subject removed");
      fetchTeacher();
    } catch {
      toast.error("Failed to remove subject");
    }
  };
  
  const assignedIds = subjects.map((s) => s.id);
  const availableSubjects = allSubjects.filter((s) => !assignedIds.includes(s.id));
  
  if (loading) return <DetailSkeleton/>;
  
  return (
     <div className="space-y-5">
       <PageHeader
          title={getFullName(teacher?.firstName, teacher?.lastName)}
          subtitle={`Employee ID: ${teacher?.employeeId ?? "—"}`}
          backTo="/teachers"
          breadcrumbs={[
            { label: "Teachers", path: "/teachers" },
            { label: getFullName(teacher?.firstName, teacher?.lastName) },
          ]}
          actions={
             isAdmin && (
                <div className="flex gap-2">
                  <Button variant="outline"
                          onClick={() => navigate(`/teachers/${id}/edit`)}>
                    <Pencil className="w-4 h-4 mr-2"/> Edit
                  </Button>
                  <Button variant="destructive" onClick={() => setShowDel(true)}>
                    <Trash2 className="w-4 h-4 mr-2"/> Delete
                  </Button>
                </div>
             )
          }
       />
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
         
         {/* Profile Card */}
         <Card className="lg:col-span-1">
           <CardContent className="p-6">
             <div className="flex flex-col items-center text-center gap-4">
               <div className="relative">
                 <Avatar className="w-28 h-28">
                   <AvatarImage
                      src={teacher?.photo ? `/uploads/${teacher.photo}` : undefined}
                   />
                   <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl font-bold">
                     {getInitials(teacher?.firstName, teacher?.lastName)}
                   </AvatarFallback>
                 </Avatar>
                 {isAdmin && (
                    <label className="absolute bottom-0 right-0 p-1.5 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700">
                      <Camera className="w-3.5 h-3.5 text-white"/>
                      <input type="file" accept="image/*"
                             className="hidden" onChange={handlePhotoUpload}
                             disabled={uploading}/>
                    </label>
                 )}
               </div>
               
               <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                   {getFullName(teacher?.firstName, teacher?.lastName)}
                 </h2>
                 <p className="text-sm text-muted-foreground mt-0.5">
                   {teacher?.qualification ?? "Teacher"}
                 </p>
                 <div className="mt-2">
                   <StatusBadge status={teacher?.status}/>
                 </div>
               </div>
               
               <div className="w-full space-y-2.5 text-sm text-left pt-2 border-t">
                 <InfoRow icon={Hash} label="Employee ID" value={teacher?.employeeId}/>
                 <InfoRow icon={User} label="Gender" value={teacher?.gender}/>
                 <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(teacher?.dob)}/>
                 <InfoRow icon={Phone} label="Phone" value={teacher?.phone}/>
                 <InfoRow icon={Mail} label="Email" value={teacher?.email}/>
                 <InfoRow icon={MapPin} label="Address" value={teacher?.address}/>
                 <InfoRow icon={Award} label="Joined" value={formatDate(teacher?.joiningDate)}/>
               </div>
             </div>
           </CardContent>
         </Card>
         
         {/* Tabs */}
         <div className="lg:col-span-2 space-y-4">
           <Tabs defaultValue="professional">
             <TabsList className="w-full">
               <TabsTrigger value="professional" className="flex-1">Professional</TabsTrigger>
               <TabsTrigger value="subjects" className="flex-1">Subjects</TabsTrigger>
               <TabsTrigger value="timetable" className="flex-1">Timetable</TabsTrigger>
             </TabsList>
             
             {/* Professional */}
             <TabsContent value="professional">
               <Card>
                 <CardHeader>
                   <CardTitle className="text-base">Professional Details</CardTitle>
                 </CardHeader>
                 <CardContent className="grid grid-cols-2 gap-4 text-sm">
                   <DetailField label="Employee ID" value={teacher?.employeeId}/>
                   <DetailField label="Qualification" value={teacher?.qualification}/>
                   <DetailField label="Joining Date" value={formatDate(teacher?.joiningDate)}/>
                   <DetailField label="Experience" value={teacher?.experience ? `${teacher.experience} years` : "—"}/>
                   <DetailField label="Salary" value={teacher?.salary ? `₹${teacher.salary}` : "—"}/>
                   <DetailField label="Status" value={<StatusBadge status={teacher?.status}/>}/>
                 </CardContent>
               </Card>
             </TabsContent>
             
             {/* Subjects */}
             <TabsContent value="subjects">
               <Card>
                 <CardHeader>
                   <CardTitle className="text-base">Assigned Subjects</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   
                   {/* Assign new subject */}
                   {isAdmin && availableSubjects.length > 0 && (
                      <div className="flex gap-2">
                        <Select value={addingSubjectId}
                                onValueChange={setAddingSubjectId}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select subject to assign"/>
                          </SelectTrigger>
                          <SelectContent>
                            {availableSubjects.map((s) => (
                               <SelectItem key={s.id} value={String(s.id)}>
                                 {s.name} ({s.code})
                               </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAssignSubject}
                                disabled={!addingSubjectId}
                                className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-1"/> Assign
                        </Button>
                      </div>
                   )}
                   
                   {/* Subject list */}
                   {subjects.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No subjects assigned yet
                      </p>
                   ) : (
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((s) => (
                           <div key={s.id}
                                className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-full text-sm font-medium">
                             <BookOpen className="w-3.5 h-3.5"/>
                             {s.name}
                             {isAdmin && (
                                <button
                                   onClick={() => handleRemoveSubject(s.id)}
                                   className="ml-1 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5"/>
                                </button>
                             )}
                           </div>
                        ))}
                      </div>
                   )}
                 </CardContent>
               </Card>
             </TabsContent>
             
             {/* Timetable */}
             <TabsContent value="timetable">
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                   <CardTitle className="text-base">Timetable</CardTitle>
                   <Button variant="outline" size="sm"
                           onClick={() => navigate("/timetable")}>
                     View Full Timetable
                   </Button>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground text-center py-8">
                     Timetable entries for this teacher will appear here.
                   </p>
                 </CardContent>
               </Card>
             </TabsContent>
           </Tabs>
         </div>
       </div>
       
       <ConfirmDialog
          open={showDel}
          onOpenChange={setShowDel}
          title="Delete Teacher"
          description={`Are you sure you want to delete ${getFullName(teacher?.firstName, teacher?.lastName)}?`}
          confirmLabel="Delete"
          isLoading={deleting}
          onConfirm={handleDelete}
       />
     </div>
  );
}

function InfoRow ({ icon: Icon, label, value }) {
  return (
     <div className="flex items-start gap-2.5 text-sm">
       <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5"/>
       <div>
         <span className="text-muted-foreground">{label}: </span>
         <span className="font-medium text-gray-900 dark:text-white">{value ?? "—"}</span>
       </div>
     </div>
  );
}

function DetailField ({ label, value }) {
  return (
     <div>
       <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
       <p className="font-medium text-gray-900 dark:text-white">{value ?? "—"}</p>
     </div>
  );
}

function DetailSkeleton () {
  return (
     <div className="space-y-5">
       <Skeleton className="h-10 w-64"/>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
         <Skeleton className="h-96 rounded-xl"/>
         <Skeleton className="h-96 rounded-xl lg:col-span-2"/>
       </div>
     </div>
  );
}