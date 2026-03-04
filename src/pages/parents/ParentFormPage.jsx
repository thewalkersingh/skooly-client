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
import { parentApi } from "@/api/parentApi";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
  relation: z.string().optional(),
});

export default function ParentFormPage () {
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
    parentApi.getById(id)
       .then((res) => {
         const p = res.data;
         const fields = [
           "firstName", "lastName", "email", "phone",
           "gender", "occupation", "address", "relation",
         ];
         fields.forEach((f) => setValue(f, p[f] ?? ""));
       })
       .catch(() => toast.error("Failed to load parent"));
  }, [id, isEdit]);
  
  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await parentApi.update(id, data);
        toast.success("Parent updated");
      } else {
        await parentApi.create(data);
        toast.success("Parent added");
      }
      navigate("/parents");
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
     <div className="space-y-5 max-w-2xl">
       <PageHeader
          title={isEdit ? "Edit Parent" : "Add Parent"}
          backTo="/parents"
          breadcrumbs={[
            { label: "Parents", path: "/parents" },
            { label: isEdit ? "Edit" : "New Parent" },
          ]}
       />
       
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         
         {/* Personal Info */}
         <Card>
           <CardHeader>
             <CardTitle className="text-base">Personal Information</CardTitle>
           </CardHeader>
           <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <F label="First Name *" error={errors.firstName?.message}>
               <Input placeholder="Jane" {...register("firstName")} />
             </F>
             <F label="Last Name *" error={errors.lastName?.message}>
               <Input placeholder="Doe" {...register("lastName")} />
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
             <F label="Relation to Student">
               <Select onValueChange={(v) => setValue("relation", v)}>
                 <SelectTrigger><SelectValue placeholder="Select relation"/></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="FATHER">Father</SelectItem>
                   <SelectItem value="MOTHER">Mother</SelectItem>
                   <SelectItem value="GUARDIAN">Guardian</SelectItem>
                   <SelectItem value="GRANDPARENT">Grandparent</SelectItem>
                   <SelectItem value="SIBLING">Sibling</SelectItem>
                   <SelectItem value="OTHER">Other</SelectItem>
                 </SelectContent>
               </Select>
             </F>
             <F label="Phone">
               <Input placeholder="+91 9999999999" {...register("phone")} />
             </F>
             <F label="Email" error={errors.email?.message}>
               <Input placeholder="jane@example.com" {...register("email")} />
             </F>
             <F label="Occupation">
               <Input placeholder="e.g. Engineer" {...register("occupation")} />
             </F>
             <F label="Address" className="sm:col-span-2">
               <Textarea placeholder="Full address..." rows={2}
                         {...register("address")} />
             </F>
           </CardContent>
         </Card>
         
         <div className="flex justify-end gap-3">
           <Button type="button" variant="outline"
                   onClick={() => navigate("/parents")}>
             Cancel
           </Button>
           <Button type="submit"
                   className="bg-blue-600 hover:bg-blue-700"
                   disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {isEdit ? "Update Parent" : "Add Parent"}
           </Button>
         </div>
       </form>
     </div>
  );
}