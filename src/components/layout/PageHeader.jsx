import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export default function PageHeader ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  backTo,
  className,
}) {
  const navigate = useNavigate();
  
  return (
     <div className={cn("mb-6", className)}>
       
       {/* Breadcrumbs */}
       {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            {breadcrumbs.map((crumb, index) => (
               <span key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5"/>}
                 {crumb.path ? (
                    <button
                       onClick={() => navigate(crumb.path)}
                       className="hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </button>
                 ) : (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                 )}
            </span>
            ))}
          </nav>
       )}
       
       {/* Title row */}
       <div className="flex items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           
           {/* Back button */}
           {backTo && (
              <button
                 onClick={() => navigate(backTo)}
                 className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-5 h-5"/>
              </button>
           )}
           
           <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
               {title}
             </h1>
             {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
             )}
           </div>
         </div>
         
         {/* Action buttons */}
         {actions && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}
            </div>
         )}
       </div>
     </div>
  );
}