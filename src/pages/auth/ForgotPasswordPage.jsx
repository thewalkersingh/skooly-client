import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, GraduationCap, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { authApi } from "@/api/authApi";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
});

export default function ForgotPasswordPage () {
  const navigate = useNavigate();
  
  const {
    register, handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data) => {
    try {
      await authApi.forgotPassword(data);
      toast.success("Reset instructions sent if the username exists");
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
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
         </div>
         
         <Card className="shadow-xl border-0">
           <CardHeader className="pb-4">
             <CardTitle className="text-2xl font-semibold">Forgot Password</CardTitle>
             <CardDescription>
               Enter your username and we'll generate a reset token
             </CardDescription>
           </CardHeader>
           
           <CardContent>
             {isSubmitSuccessful ? (
                // Success state
                <div className="text-center space-y-4 py-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mx-auto">
                    <Mail className="w-7 h-7 text-green-600"/>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Request Submitted</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      If the username exists, a reset link has been generated.
                      Contact your administrator for the reset token.
                    </p>
                  </div>
                  <Button
                     variant="outline"
                     className="w-full"
                     onClick={() => navigate("/login")}
                  >
                    Back to Login
                  </Button>
                </div>
             ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  
                  <Button
                     type="submit"
                     className="w-full bg-blue-600 hover:bg-blue-700"
                     disabled={isSubmitting}
                  >
                    {isSubmitting
                       ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Sending...</>
                       : "Send Reset Request"
                    }
                  </Button>
                  
                  <button
                     type="button"
                     onClick={() => navigate("/login")}
                     className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-full justify-center"
                  >
                    <ArrowLeft className="w-4 h-4"/> Back to Login
                  </button>
                </form>
             )}
           </CardContent>
         </Card>
       </div>
     </div>
  );
}