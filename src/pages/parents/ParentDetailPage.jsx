import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Pencil, Trash2, Camera,
  Phone, Mail, MapPin, Briefcase,
  Plus, X, GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { parentApi } from "@/api/parentApi";
import { studentApi } from "@/api/studentApi";
import { getInitials, getFullName, formatDate } from "@/utils/formatters";
import useAuthStore from "@/store/authStore";

export default function ParentDetailPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  
  const [parent, setParent] = useState(null);
  const [children, setChildren] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDel, setShowDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [linkId, setLinkId] = useState("");
  const [linking, setLinking] = useState(false);
  const [unlinking, setUnlinking] = useState(null);
  
  useEffect(() => { fetchData(); }, [id]);
  
  useEffect(() => {
    studentApi.getAll({ status: "ACTIVE", page: 1, size: 200 })
       .then((res) => setAllStudents(res.data?.data ?? []));
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        parentApi.getById(id),
        parentApi.getChildren(id),
      ]);
      setParent(pRes.data);
      setChildren(cRes.data ?? []);
    } catch {
      toast.error("Failed to load parent");
      navigate("/parents");
    } finally { setLoading(false); }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await parentApi.delete(id);
      toast.success("Parent deleted");
      navigate("/parents");
    } catch {
      toast.error("Failed to delete parent");
      setDeleting(false);
    }
  };
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await parentApi.uploadPhoto(id, file);
      setParent(res.data);
      toast.success("Photo updated");
    } catch { toast.error("Failed to upload photo"); } finally { setUploading(false); }
  };
  
  const handleLink = async () => {
    if (!linkId) return;
    setLinking(true);
    try {
      await parentApi.linkStudent(id, linkId);
      toast.success("Student linked");
      setLinkId("");
      fetchData();
    } catch { toast.error("Failed to link student"); } finally { setLinking(false); }
  };
  
  const handleUnlink = async (studentId) => {
    setUnlinking(studentId);
    try {
      await parentApi.unlinkStudent(id, studentId);
      toast.success("Student unlinked");
      fetchData();
    } catch { toast.error("Failed to unlink student"); } finally { setUnlinking(null); }
  };
  
  // Available students not already linked
  const linkedIds = children.map((c) => c.id);
  const availableStudents = allStudents.filter((s) => !linkedIds.includes(s.id));
  
  if (loading) return <DetailSkeleton/>;
  
  return (
     <div className="space-y-5">
       <PageHeader
          title={getFullName(parent?.firstName, parent?.lastName)}
          subtitle={`Parent / Guardian`}
          backTo="/parents"
          breadcrumbs={[
            { label: "Parents", path: "/parents" },
            { label: getFullName(parent?.firstName, parent?.lastName) },
          ]}
          actions={
             isAdmin && (
                <div className="flex gap-2">
                  <Button variant="outline"
                          onClick={() => navigate(`/parents/${id}/edit`)}>
                    <Pencil className="w-4 h-4 mr-2"/> Edit
                  </Button>
                  <Button variant="destructive"
                          onClick={() => setShowDel(true)}>
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
               
               {/* Avatar */}
               <div className="relative">
                 <Avatar className="w-28 h-28">
                   <AvatarImage
                      src={parent?.photo ? `/uploads/${parent.photo}` : undefined}
                   />
                   <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl font-bold">
                     {getInitials(parent?.firstName, parent?.lastName)}
                   </AvatarFallback>
                 </Avatar>
                 {isAdmin && (
                    <label className="absolute bottom-0 right-0 p-1.5 bg-teal-600 rounded-full cursor-pointer hover:bg-teal-700 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-white"/>
                      <input type="file" accept="image/*" className="hidden"
                             onChange={handlePhotoUpload} disabled={uploading}/>
                    </label>
                 )}
               </div>
               
               <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                   {getFullName(parent?.firstName, parent?.lastName)}
                 </h2>
                 <p className="text-sm text-muted-foreground mt-0.5">
                   {parent?.occupation ?? "Parent / Guardian"}
                 </p>
                 <div className="mt-2">
                   <StatusBadge status={parent?.status}/>
                 </div>
               </div>
               
               {/* Info rows */}
               <div className="w-full space-y-2.5 text-sm text-left pt-2 border-t">
                 <InfoRow icon={Phone} label="Phone" value={parent?.phone}/>
                 <InfoRow icon={Mail} label="Email" value={parent?.email}/>
                 <InfoRow icon={Briefcase} label="Occupation" value={parent?.occupation}/>
                 <InfoRow icon={MapPin} label="Address" value={parent?.address}/>
               </div>
             </div>
           </CardContent>
         </Card>
         
         {/* Children */}
         <div className="lg:col-span-2 space-y-4">
           <Card>
             <CardHeader className="pb-3">
               <CardTitle className="text-base">
                 Linked Children ({children.length})
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               
               {/* Link new student */}
               {isAdmin && availableStudents.length > 0 && (
                  <div className="flex gap-2">
                    <Select value={linkId} onValueChange={setLinkId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select student to link"/>
                      </SelectTrigger>
                      <SelectContent>
                        {availableStudents.map((s) => (
                           <SelectItem key={s.id} value={String(s.id)}>
                             {getFullName(s.firstName, s.lastName)}
                             {s.className ? ` — ${s.className}` : ""}
                           </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleLink}
                            disabled={!linkId || linking}
                            className="bg-blue-600 hover:bg-blue-700 shrink-0">
                      {linking
                         ?
                         <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                         : <><Plus className="w-4 h-4 mr-1"/> Link</>
                      }
                    </Button>
                  </div>
               )}
               
               {/* Children list */}
               {children.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-2"/>
                    <p className="text-sm text-muted-foreground">No children linked yet</p>
                  </div>
               ) : (
                  <div className="space-y-2">
                    {children.map((child) => (
                       <div key={child.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                         <div className="flex items-center gap-3">
                           <Avatar className="w-10 h-10">
                             <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                               {getInitials(child.firstName, child.lastName)}
                             </AvatarFallback>
                           </Avatar>
                           <div>
                             <p className="font-medium text-sm text-gray-900 dark:text-white">
                               {getFullName(child.firstName, child.lastName)}
                             </p>
                             <p className="text-xs text-muted-foreground">
                               {child.className
                                  ? `${child.className}${child.sectionName ? ` - ${child.sectionName}` : ""}`
                                  : "No class assigned"}
                               {child.rollNumber ? ` • Roll ${child.rollNumber}` : ""}
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <StatusBadge status={child.status}/>
                           <button
                              onClick={() => navigate(`/students/${child.id}`)}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                             View
                           </button>
                           {isAdmin && (
                              <button
                                 onClick={() => handleUnlink(child.id)}
                                 disabled={unlinking === child.id}
                                 className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                                {unlinking === child.id
                                   ?
                                   <span className="h-3.5 w-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin inline-block"/>
                                   : <X className="w-3.5 h-3.5"/>
                                }
                              </button>
                           )}
                         </div>
                       </div>
                    ))}
                  </div>
               )}
             </CardContent>
           </Card>
           
           {/* Additional info card */}
           <Card>
             <CardHeader className="pb-3">
               <CardTitle className="text-base">Account Information</CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-2 gap-4 text-sm">
               <DetailField label="Registered On" value={formatDate(parent?.createdAt)}/>
               <DetailField label="Status" value={<StatusBadge status={parent?.status}/>}/>
               <DetailField label="Total Children" value={children.length}/>
               <DetailField label="Email" value={parent?.email ?? "—"}/>
             </CardContent>
           </Card>
         </div>
       </div>
       
       <ConfirmDialog open={showDel} onOpenChange={setShowDel}
                      title="Delete Parent"
                      description={`Delete ${getFullName(parent?.firstName,
                         parent?.lastName)} and unlink all children?`}
                      confirmLabel="Delete" isLoading={deleting} onConfirm={handleDelete}
       />
     </div>
  );
}

function InfoRow ({ icon: Icon, label, value }) {
  return (
     <div className="flex items-start gap-2.5">
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
         <div className="lg:col-span-2 space-y-4">
           <Skeleton className="h-64 rounded-xl"/>
           <Skeleton className="h-32 rounded-xl"/>
         </div>
       </div>
     </div>
  );
}