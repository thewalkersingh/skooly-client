import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Pencil, Trash2, Camera, User,
  Phone, Mail, MapPin, Calendar,
  BookOpen, GraduationCap, Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { studentApi } from "@/api/studentApi";
import {
  getInitials, getFullName,
  formatDate
} from "@/utils/formatters";
import useAuthStore from "@/store/authStore";

export default function StudentDetailPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => { fetchStudent(); }, [id]);
  
  const fetchStudent = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getById(id);
      setStudent(res.data);
    } catch {
      toast.error("Failed to load student");
      navigate("/students");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentApi.delete(id);
      toast.success("Student deleted");
      navigate("/students");
    } catch {
      toast.error("Failed to delete student");
      setDeleting(false);
    }
  };
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await studentApi.uploadPhoto(id, file);
      setStudent(res.data);
      toast.success("Photo updated");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };
  
  if (loading) return <DetailSkeleton/>;
  
  return (
     <div className="space-y-5">
       <PageHeader
          title={getFullName(student?.firstName, student?.lastName)}
          subtitle={`Student ID: ${student?.id}`}
          backTo="/students"
          breadcrumbs={[
            { label: "Students", path: "/students" },
            { label: getFullName(student?.firstName, student?.lastName) },
          ]}
          actions={
             isAdmin && (
                <div className="flex gap-2">
                  <Button
                     variant="outline"
                     onClick={() => navigate(`/students/${id}/edit`)}
                  >
                    <Pencil className="w-4 h-4 mr-2"/> Edit
                  </Button>
                  <Button
                     variant="destructive"
                     onClick={() => setShowDel(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2"/> Delete
                  </Button>
                </div>
             )
          }
       />
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
         
         {/* ── Profile Card ───────────────────────────────── */}
         <Card className="lg:col-span-1">
           <CardContent className="p-6">
             <div className="flex flex-col items-center text-center gap-4">
               
               {/* Avatar with upload */}
               <div className="relative">
                 <Avatar className="w-28 h-28">
                   <AvatarImage
                      src={student?.photo ? `/uploads/${student.photo}` : undefined}
                   />
                   <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                     {getInitials(student?.firstName, student?.lastName)}
                   </AvatarFallback>
                 </Avatar>
                 {isAdmin && (
                    <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-white"/>
                      <input
                         type="file"
                         accept="image/*"
                         className="hidden"
                         onChange={handlePhotoUpload}
                         disabled={uploading}
                      />
                    </label>
                 )}
               </div>
               
               <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                   {getFullName(student?.firstName, student?.lastName)}
                 </h2>
                 <p className="text-sm text-muted-foreground mt-0.5">
                   {student?.className} • {student?.sectionName}
                 </p>
                 <div className="mt-2">
                   <StatusBadge status={student?.status}/>
                 </div>
               </div>
               
               {/* Quick info */}
               <div className="w-full space-y-2.5 text-sm text-left pt-2 border-t w-full">
                 <InfoRow icon={Hash} label="Roll No" value={student?.rollNumber}/>
                 <InfoRow icon={GraduationCap} label="Class" value={`${student?.className} - ${student?.sectionName}`}/>
                 <InfoRow icon={User} label="Gender" value={student?.gender}/>
                 <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(student?.dob)}/>
                 <InfoRow icon={Phone} label="Phone" value={student?.phone}/>
                 <InfoRow icon={Mail} label="Email" value={student?.email}/>
                 <InfoRow icon={MapPin} label="Address" value={student?.address}/>
               </div>
             </div>
           </CardContent>
         </Card>
         
         {/* ── Tabs ───────────────────────────────────────── */}
         <div className="lg:col-span-2">
           <Tabs defaultValue="academic">
             <TabsList className="w-full">
               <TabsTrigger value="academic" className="flex-1">Academic</TabsTrigger>
               <TabsTrigger value="parent" className="flex-1">Parent Info</TabsTrigger>
               <TabsTrigger value="fees" className="flex-1">Fees</TabsTrigger>
             </TabsList>
             
             {/* Academic */}
             <TabsContent value="academic">
               <Card>
                 <CardHeader>
                   <CardTitle className="text-base">Academic Details</CardTitle>
                 </CardHeader>
                 <CardContent className="grid grid-cols-2 gap-4 text-sm">
                   <DetailField label="Class" value={student?.className}/>
                   <DetailField label="Section" value={student?.sectionName}/>
                   <DetailField label="Roll Number" value={student?.rollNumber}/>
                   <DetailField label="Academic Year" value={student?.academicYear ?? "—"}/>
                   <DetailField label="Admission No" value={student?.admissionNumber ?? "—"}/>
                   <DetailField label="Joined On" value={formatDate(student?.createdAt)}/>
                 </CardContent>
               </Card>
             </TabsContent>
             
             {/* Parent */}
             <TabsContent value="parent">
               <Card>
                 <CardHeader>
                   <CardTitle className="text-base">Parent / Guardian</CardTitle>
                 </CardHeader>
                 <CardContent className="grid grid-cols-2 gap-4 text-sm">
                   <DetailField label="Parent Name" value={student?.parentName ?? "—"}/>
                   <DetailField label="Relation" value={student?.relation ?? "—"}/>
                   <DetailField label="Phone" value={student?.parentPhone ?? "—"}/>
                   <DetailField label="Email" value={student?.parentEmail ?? "—"}/>
                   <DetailField label="Occupation" value={student?.occupation ?? "—"} className="col-span-2"/>
                 </CardContent>
               </Card>
             </TabsContent>
             
             {/* Fees */}
             <TabsContent value="fees">
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                   <CardTitle className="text-base">Fee History</CardTitle>
                   <Button
                      variant="outline" size="sm"
                      onClick={() => navigate("/fees")}
                   >
                     <BookOpen className="w-4 h-4 mr-1"/> View All
                   </Button>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground text-center py-8">
                     Fee records will appear here.
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
          title="Delete Student"
          description={`Are you sure you want to delete ${getFullName(student?.firstName,
             student?.lastName)}? This cannot be undone.`}
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

function DetailField ({ label, value, className = "" }) {
  return (
     <div className={className}>
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