import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { feeApi } from "@/api/feeApi";
import { studentApi } from "@/api/studentApi";
import { classApi } from "@/api/classApi";
import { MONTHS } from "@/utils/constants";

const schema = z.object({
  studentId: z.string().min(1, "Student is required"),
  feeCategoryId: z.string().min(1, "Category is required"),
  totalAmount: z.string().min(1, "Amount is required"),
  amountPaid: z.string().min(1, "Amount paid is required"),
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  month: z.string().optional(),
  year: z.string().optional(),
  remarks: z.string().optional(),
});

export default function FeePaymentPage () {
  const navigate = useNavigate();
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  
  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
  });
  
  useEffect(() => {
    Promise.all([
      classApi.getAll({ page: 1, size: 100 }),
      feeApi.getCategories({ page: 1, size: 100 }),
    ]).then(([c, cat]) => {
      setClasses(c.data?.data ?? []);
      setCategories(cat.data?.data ?? []);
    });
  }, []);
  
  useEffect(() => {
    if (!classId) {
      setSections([]);
      return;
    }
    classApi.getSections(classId)
       .then((res) => setSections(res.data ?? []));
  }, [classId]);
  
  useEffect(() => {
    if (!classId) {
      setStudents([]);
      return;
    }
    studentApi.getAll({
      classId,
      sectionId: sectionId || undefined,
      status: "ACTIVE", page: 1, size: 200,
    }).then((res) => setStudents(res.data?.data ?? []));
  }, [classId, sectionId]);
  
  const onSubmit = async (data) => {
    try {
      await feeApi.createPayment({
        studentId: Number(data.studentId),
        feeCategoryId: Number(data.feeCategoryId),
        totalAmount: Number(data.totalAmount),
        amountPaid: Number(data.amountPaid),
        dueDate: data.dueDate || undefined,
        paidDate: data.paidDate || undefined,
        month: data.month ? Number(data.month) : undefined,
        year: data.year ? Number(data.year) : undefined,
        remarks: data.remarks || undefined,
      });
      toast.success("Payment recorded successfully!");
      navigate("/fees");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    }
  };
  
  const F = ({ label, error, children, className = "" }) => (
     <div className={`space-y-1.5 ${className}`}>
       <Label className="text-sm">{label}</Label>
       {children}
       {error && <p className="text-xs text-red-500">{error}</p>}
     </div>
  );
  
  return (
     <div className="space-y-5 max-w-2xl">
       <PageHeader
          title="Record Fee Payment"
          backTo="/fees"
          breadcrumbs={[
            { label: "Fees", path: "/fees" },
            { label: "Record Payment" },
          ]}
       />
       
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         
         {/* Student Selection */}
         <Card>
           <CardHeader>
             <CardTitle className="text-base">Select Student</CardTitle>
           </CardHeader>
           <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <F label="Class">
               <Select value={classId} onValueChange={(v) => {
                 setClassId(v);
                 setSectionId("");
                 setValue("studentId", "");
               }}>
                 <SelectTrigger><SelectValue placeholder="Select class"/></SelectTrigger>
                 <SelectContent>
                   {classes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </F>
             
             <F label="Section">
               <Select value={sectionId} onValueChange={(v) => {
                 setSectionId(v);
                 setValue("studentId", "");
               }} disabled={!classId}>
                 <SelectTrigger><SelectValue placeholder="All"/></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="">All</SelectItem>
                   {sections.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </F>
             
             <F label="Student *" error={errors.studentId?.message}>
               <Select disabled={!classId}
                       onValueChange={(v) => setValue("studentId", v)}>
                 <SelectTrigger><SelectValue placeholder="Select student"/></SelectTrigger>
                 <SelectContent>
                   {students.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.firstName} {s.lastName}
                      </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </F>
           </CardContent>
         </Card>
         
         {/* Payment Details */}
         <Card>
           <CardHeader>
             <CardTitle className="text-base">Payment Details</CardTitle>
           </CardHeader>
           <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <F label="Fee Category *" error={errors.feeCategoryId?.message}>
               <Select onValueChange={(v) => setValue("feeCategoryId", v)}>
                 <SelectTrigger><SelectValue placeholder="Select category"/></SelectTrigger>
                 <SelectContent>
                   {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </F>
             
             <F label="Month">
               <Select onValueChange={(v) => setValue("month", v)}>
                 <SelectTrigger><SelectValue placeholder="Select month"/></SelectTrigger>
                 <SelectContent>
                   {MONTHS.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </F>
             
             <F label="Total Amount (₹) *" error={errors.totalAmount?.message}>
               <Input type="number" min="0" placeholder="5000"
                      {...register("totalAmount")} />
             </F>
             
             <F label="Amount Paid (₹) *" error={errors.amountPaid?.message}>
               <Input type="number" min="0" placeholder="5000"
                      {...register("amountPaid")} />
             </F>
             
             <F label="Due Date">
               <Input type="date" {...register("dueDate")} />
             </F>
             
             <F label="Paid Date">
               <Input type="date" {...register("paidDate")} />
             </F>
             
             <F label="Remarks" className="sm:col-span-2">
               <Textarea placeholder="Optional remarks..."
                         rows={2} {...register("remarks")} />
             </F>
           </CardContent>
         </Card>
         
         {/* Actions */}
         <div className="flex justify-end gap-3">
           <Button type="button" variant="outline"
                   onClick={() => navigate("/fees")}>
             Cancel
           </Button>
           <Button type="submit"
                   className="bg-blue-600 hover:bg-blue-700"
                   disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             Record Payment
           </Button>
         </div>
       </form>
     </div>
  );
}