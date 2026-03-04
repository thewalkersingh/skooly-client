import { useEffect } from "react";
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
import { staffApi } from "@/api/staffApi";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  joiningDate: z.string().optional(),
  salary: z.string().optional(),
});

export default function StaffFormPage () {
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
    staffApi.getById(id)
       .then((res) => {
         const s = res.data;
         const fields = ["firstName", "lastName", "dob", "gender", "phone",
           "email", "address", "employeeId", "designation", "joiningDate"];
         fields.forEach((f) => setValue(f, s[f] ?? ""));
         if (s.department) setValue("department", s.department);
         if (s.salary) setValue("salary", String(s.salary));
       })
       .catch(() => toast.error("Failed to load staff member"));
  }, [id, isEdit]);
  
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      salary: data.salary ? Number(data.salary) : undefined,
      dob: data.dob || undefined,
      joiningDate: data.joiningDate || undefined,
    };
    try {
      if (isEdit) {
        await staffApi.update(id, payload);
        toast.success("Staff member updated");
      } else {
        await staffApi.create(payload);
        toast.success("Staff member added");
      }
      navigate("/staff");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    }
  };
  
  const F = ({ label, error, children, className = "" }) => (
     <div className={`space-y-1.5 ${className}`}>
       <Label>{label}</Label>
       {children}
       {error && <p className="text-xs text-red-500">{error}</p>}
     </div>
  );
  
  return (
     <div className="space-y-5 max-w-3xl">
       <PageHeader
          title={isEdit ? "Edit Staff Member" : "Add Staff Member"}
          backTo="/staff"
          breadcrumbs={[
            { label: "Staff", path: "/staff" },
            { label: isEdit ? "Edit" : "New Staff" },
          ]}
       />
       
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         
         {/* Personal */}
         <Card>
           <CardHeader>
             <CardTitle className="text-base">Personal Information</CardTitle>
           </CardHeader>
           <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <F label="First Name *" error={errors.firstName?.message}>
               <Input placeholder="John" {...register("firstName")} />
             </F>
             <F label="Last Name *" error={errors.lastName?.message}>
               <Input placeholder="Doe" {...register("lastName")} />
             </F>
             <F label="Date of Birth">
               <Input type="date" {...register("dob")} />
             </F>
             <F label="Gender">
               <Select onValueChange={(v) => setValue("gender", v)}>
                 <SelectTrigger><SelectValue placeholder="Select gender"/></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="MALE">Male</SelectItem>
                   <SelectItem value="FEMALE">Female</SelectItem>
                   <SelectItem value="OTHER">Other</SelectItem>
                 </SelectContent>
               </Select>
             </F>
             <F label="Phone">
               <Input placeholder="+91 9999999999" {...register("phone")} />
             </F>
             <F label="Email" error={errors.email?.message}>
               <Input placeholder="john@school.com" {...register("email")} />
             </F>
             <F label="Address" className="sm:col-span-2">
               <Textarea placeholder="Full address..." rows={2} {...register("address")} />
             </F>
           </CardContent>
         </Card>
         
         {/* Professional */}
         <Card>
           <CardHeader>
             <CardTitle className="text-base">Professional Information</CardTitle>
           </CardHeader>
           <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <F label="Employee ID">
               <Input placeholder="e.g. STF001" {...register("employeeId")} />
             </F>
             <F label="Department">
               <Select onValueChange={(v) => setValue("department", v)}>
                 <SelectTrigger><SelectValue placeholder="Select department"/></SelectTrigger>
                 <SelectContent>
                   {["Administration", "Finance", "Maintenance", "Security",
                     "IT", "Library", "Transport", "Canteen"].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </F>
             <F label="Designation">
               <Input placeholder="e.g. Accountant" {...register("designation")} />
             </F>
             <F label="Joining Date">
               <Input type="date" {...register("joiningDate")} />
             </F>
             <F label="Salary (₹)">
               <Input type="number" min="0" placeholder="30000" {...register("salary")} />
             </F>
           </CardContent>
         </Card>
         
         <div className="flex justify-end gap-3">
           <Button type="button" variant="outline"
                   onClick={() => navigate("/staff")}>
             Cancel
           </Button>
           <Button type="submit"
                   className="bg-blue-600 hover:bg-blue-700"
                   disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {isEdit ? "Update" : "Add Staff"}
           </Button>
         </div>
       </form>
     </div>
  );
}