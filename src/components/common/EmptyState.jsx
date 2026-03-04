import { cn } from "@/utils/cn";

export default function EmptyState ({
  icon: Icon,
  title = "No data found",
  description,
  action,
  className,
}) {
  return (
     <div className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
     )}>
       {Icon && (
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Icon className="w-8 h-8 text-muted-foreground"/>
          </div>
       )}
       <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
         {title}
       </h3>
       {description && (
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            {description}
          </p>
       )}
       {action}
     </div>
  );
}