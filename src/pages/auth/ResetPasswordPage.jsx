import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { authApi } from "@/api/authApi";

const schema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.newPassword === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

export default function ResetPasswordPage () {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  
  const {
    register, handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data) => {
    try {
      await authApi.resetPassword({
        token: data.token,
        newPassword: data.newPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Invalid or expired token");
    }
  };
  
  const PasswordField = ({ id, label, show, toggle, field, error }) => (
     <div className="space-y-1.5">
       <Label htmlFor={id}>{label}</Label>
       <div className="relative">
         <Input
            id={id}
            type={show ? "text" : "password"}
            placeholder={`Enter ${label.toLowerCase()}`}
            {...field}
            className={error ? "border-red-500 pr-10" : "pr-10"}
         />
         <button
            type="button"
            onClick={toggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
         >
           {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
         </button>
       </div>
       {error && <p className="text-xs text-red-500">{error.message}</p>}
     </div>
  );
  
  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
       <div className="w-full max-w-md space-y-6">
         
         <div className="flex flex-col items-center gap-2">
           <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg">
             <GraduationCap className="w-8 h-8 text-white"/>
           </div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skooly</h1>
         </div>
         
         <Card className="shadow-xl border-0">
           <CardHeader className="pb-4">
             <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
             <CardDescription>Enter your reset token and new password</CardDescription>
           </CardHeader>
           
           <CardContent>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               
               {/* Token */}
               <div className="space-y-1.5">
                 <Label htmlFor="token">Reset Token</Label>
                 <Input
                    id="token"
                    placeholder="Paste your reset token"
                    {...register("token")}
                    className={errors.token ? "border-red-500" : ""}
                 />
                 {errors.token && (
                    <p className="text-xs text-red-500">{errors.token.message}</p>
                 )}
               </div>
               
               <PasswordField
                  id="newPassword" label="New Password"
                  show={showPass} toggle={() => setShowPass(!showPass)}
                  field={register("newPassword")} error={errors.newPassword}
               />
               
               <PasswordField
                  id="confirm" label="Confirm Password"
                  show={showConf} toggle={() => setShowConf(!showConf)}
                  field={register("confirm")} error={errors.confirm}
               />
               
               <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
               >
                 {isSubmitting
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Resetting...</>
                    : "Reset Password"
                 }
               </Button>
             
             </form>
           </CardContent>
         </Card>
       </div>
     </div>
  );
}