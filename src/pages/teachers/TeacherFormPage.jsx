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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/layout/PageHeader";
import { teacherApi } from "@/api/teacherApi";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  employeeId: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  joiningDate: z.string().optional(),
  salary: z.string().optional(),
});

export default function TeacherFormPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const {
    register, handleSubmit, setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
  });
  
  useEffect(() => {
    if (!isEdit) return;
    teacherApi.getById(id)
       .then((res) => {
         const t = res.data;
         const fields = [
           "firstName", "lastName", "dob", "gender", "phone", "email",
           "address", "employeeId", "qualification", "joiningDate",
         ];
         fields.forEach((f) => setValue(f, t[f] ?? ""));
         if (t.experience) setValue("experience", String(t.experience));
         if (t.salary) setValue("salary", String(t.salary));
       })
       .catch(() => toast.error("Failed to load teacher"));
  }, [id, isEdit]);
  
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      experience: data.experience ? Number(data.experience) : undefined,
      salary: data.salary ? Number(data.salary) : undefined,
      dob: data.dob || undefined,
      joiningDate: data.joiningDate || undefined,
    };
    try {
      if (isEdit) {
        await teacherApi.update(id, payload);
        toast.success("Teacher updated successfully");
      } else {
        await teacherApi.create(payload);
        toast.success("Teacher created successfully");
      }
      navigate("/teachers");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    }
  };
  
  return (
     <div className="space-y-5 max-w-3xl">
       <PageHeader
          title={isEdit ? "Edit Teacher" : "Add New Teacher"}
          backTo="/teachers"
          breadcrumbs={[
            { label: "Teachers", path: "/teachers" },
            { label: isEdit ? "Edit" : "New Teacher" },
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
               <Input placeholder="Jane" {...register("firstName")} />
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
               <Input placeholder="jane@school.com" {...register("email")} />
             </FormField>
             <FormField label="Address" className="sm:col-span-2">
               <Textarea placeholder="Full address..." rows={2} {...register("address")} />
             </FormField>
           </CardContent>
         </Card>
         
         {/* Professional Info */}
         <Card>
           <CardHeader>
             <CardTitle className="text-base">Professional Information</CardTitle>
           </CardHeader>
           <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <FormField label="Employee ID">
               <Input placeholder="e.g. TCH001" {...register("employeeId")} />
             </FormField>
             <FormField label="Qualification">
               <Input placeholder="e.g. M.Sc, B.Ed" {...register("qualification")} />
             </FormField>
             <FormField label="Experience (years)">
               <Input type="number" min="0" placeholder="5" {...register("experience")} />
             </FormField>
             <FormField label="Joining Date">
               <Input type="date" {...register("joiningDate")} />
             </FormField>
             <FormField label="Salary (₹)">
               <Input type="number" min="0" placeholder="50000" {...register("salary")} />
             </FormField>
           </CardContent>
         </Card>
         
         {/* Actions */}
         <div className="flex justify-end gap-3">
           <Button type="button" variant="outline"
                   onClick={() => navigate("/teachers")}>
             Cancel
           </Button>
           <Button type="submit"
                   className="bg-blue-600 hover:bg-blue-700"
                   disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {isEdit ? "Update Teacher" : "Add Teacher"}
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