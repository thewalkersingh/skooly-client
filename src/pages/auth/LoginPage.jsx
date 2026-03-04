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
import useAuthStore from "@/store/authStore";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage () {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPass, setShowPass] = useState(false);
  
  const {
    register, handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data);
      setAuth(res.data);
      toast.success(`Welcome back, ${res.data.user.username}!`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Invalid credentials");
    }
  };
  
  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
       <div className="w-full max-w-md space-y-6">
         
         {/* Logo */}
         <div className="flex flex-col items-center gap-2">
           <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg">
             <GraduationCap className="w-8 h-8 text-white"/>
           </div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skooly</h1>
           <p className="text-sm text-muted-foreground">School Management System</p>
         </div>
         
         {/* Card */}
         <Card className="shadow-xl border-0">
           <CardHeader className="space-y-1 pb-4">
             <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
             <CardDescription>Enter your credentials to continue</CardDescription>
           </CardHeader>
           
           <CardContent>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               
               {/* Username */}
               <div className="space-y-1.5">
                 <Label htmlFor="username">Username</Label>
                 <Input
                    id="username"
                    placeholder="Enter your username"
                    {...register("username")}
                    className={errors.username ? "border-red-500" : ""}
                 />
                 {errors.username && (
                    <p className="text-xs text-red-500">{errors.username.message}</p>
                 )}
               </div>
               
               {/* Password */}
               <div className="space-y-1.5">
                 <Label htmlFor="password">Password</Label>
                 <div className="relative">
                   <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                   />
                   <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                   >
                     {showPass
                        ? <EyeOff className="w-4 h-4"/>
                        : <Eye className="w-4 h-4"/>
                     }
                   </button>
                 </div>
                 {errors.password && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                 )}
               </div>
               
               {/* Forgot password */}
               <div className="flex justify-end">
                 <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-600 hover:underline"
                 >
                   Forgot password?
                 </button>
               </div>
               
               {/* Submit */}
               <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
               >
                 {isSubmitting
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Signing in...</>
                    : "Sign in"
                 }
               </Button>
             
             </form>
           </CardContent>
         </Card>
         
         <p className="text-center text-xs text-muted-foreground">
           © {new Date().getFullYear()} Skooly. All rights reserved.
         </p>
       </div>
     </div>
  );
}