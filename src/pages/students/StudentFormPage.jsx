import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Card, CardContent,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/layout/PageHeader";
import { studentApi } from "@/api/studentApi";
import { classApi } from "@/api/classApi";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  rollNumber: z.string().optional(),
  classId: z.string().optional(),
  sectionId: z.string().optional(),
  academicYear: z.string().optional(),
  parentId: z.string().optional(),
});

export default function StudentFormPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
  });
  
  const selectedClassId = watch("classId");
  
  // Load classes on mount
  useEffect(() => {
    classApi.getAll({ page: 1, size: 100 })
       .then((res) => setClasses(res.data?.data ?? []))
       .catch(() => {});
  }, []);
  
  // Load sections when class changes
  useEffect(() => {
    if (!selectedClassId) {
      setSections([]);
      return;
    }
    classApi.getSections(selectedClassId)
       .then((res) => setSections(res.data ?? []))
       .catch(() => {});
  }, [selectedClassId]);
  
  // Populate form when editing
  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    studentApi.getById(id)
       .then((res) => {
         const s = res.data;
         const fields = [
           "firstName", "lastName", "dob", "gender", "phone",
           "email", "address", "rollNumber", "academicYear",
         ];
         fields.forEach((f) => setValue(f, s[f] ?? ""));
         if (s.classId) setValue("classId", String(s.classId));
         if (s.sectionId) setValue("sectionId", String(s.sectionId));
       })
       .catch(() => toast.error("Failed to load student"))
       .finally(() => setLoading(false));
  }, [id, isEdit]);
  
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      classId: data.classId ? Number(data.classId) : undefined,
      sectionId: data.sectionId ? Number(data.sectionId) : undefined,
      parentId: data.parentId ? Number(data.parentId) : undefined,
      dob: data.dob || undefined,
    };
    
    try {
      if (isEdit) {
        await studentApi.update(id, payload);
        toast.success("Student updated successfully");
      } else {
        await studentApi.create(payload);
        toast.success("Student created successfully");
      }
      navigate("/students");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    }
  };
  
  return (
     <div className="space-y-5 max-w-3xl">
       <PageHeader
          title={isEdit ? "Edit Student" : "Add New Student"}
          backTo="/students"
          breadcrumbs={[
            { label: "Students", path: "/students" },
            { label: isEdit ? "Edit" : "New Student" },
          ]}
       />
       
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         
         {/* Personal Info */}
         <Card>
           <CardHeader>
             <CardTitle className="text-base">Personal Information</CardTitle>
           </CardHeader>
           <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             
             <FormField label="First Name *" error={errors.firstName?.message}>
               <Input placeholder="John" {...register("firstName")} />
             </FormField>
             
             <FormField label="Last Name *" error={errors.lastName?.message}>
               <Input placeholder="Doe" {...register("lastName")} />
             </FormField>
             
             <FormField label="Date of Birth">
               <Input type="date" {...register("dob")} />
             </FormField>
             
             <FormField label="Gender">
               <Select onValueChange={(v) => setValue("gender", v)}>
                 <SelectTrigger><SelectValue placeholder="Select gender"/></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="MALE">Male</SelectItem>
                   <SelectItem value="FEMALE">Female</SelectItem>
                   <SelectItem value="OTHER">Other</SelectItem>
                 </SelectContent>
               </Select>
             </FormField>
             
             <FormField label="Phone">
               <Input placeholder="+91 9999999999" {...register("phone")} />
             </FormField>
             
             <FormField label="Email" error={errors.email?.message}>
               <Input placeholder="john@school.com" {...register("email")} />
             </FormField>
             
             <FormField label="Address" className="sm:col-span-2">
               <Textarea
                  placeholder="Full address..."
                  rows={2}
                  {...register("address")}
               />
             </FormField>
           </CardContent>
         </Card>
         
         {/* Academic Info */}
         <Card>
           <CardHeader>
             <CardTitle className="text-base">Academic Information</CardTitle>
           </CardHeader>
           <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             
             <FormField label="Roll Number">
               <Input placeholder="e.g. 2024001" {...register("rollNumber")} />
             </FormField>
             
             <FormField label="Academic Year">
               <Input placeholder="e.g. 2024-2025" {...register("academicYear")} />
             </FormField>
             
             <FormField label="Class">
               <Select onValueChange={(v) => {
                 setValue("classId", v);
                 setValue("sectionId", "");
               }}>
                 <SelectTrigger><SelectValue placeholder="Select class"/></SelectTrigger>
                 <SelectContent>
                   {classes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </FormField>
             
             <FormField label="Section">
               <Select
                  disabled={!selectedClassId || sections.length === 0}
                  onValueChange={(v) => setValue("sectionId", v)}
               >
                 <SelectTrigger>
                   <SelectValue placeholder={
                     !selectedClassId ? "Select class first" : "Select section"
                   }/>
                 </SelectTrigger>
                 <SelectContent>
                   {sections.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </FormField>
           </CardContent>
         </Card>
         
         {/* Actions */}
         <div className="flex justify-end gap-3">
           <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/students")}
           >
             Cancel
           </Button>
           <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
           >
             {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {isEdit ? "Update Student" : "Add Student"}
           </Button>
         </div>
       </form>
     </div>
  );
}

function FormField ({ label, error, children, className = "" }) {
  return (
     <div className={`space-y-1.5 ${className}`}>
       <Label>{label}</Label>
       {children}
       {error && <p className="text-xs text-red-500">{error}</p>}
     </div>
  );
}