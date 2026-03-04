import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pagination ({
  page, totalPages, total, size, onPageChange
}) {
  if (totalPages <= 1) return null;
  
  const from = (page - 1) * size + 1;
  const to = Math.min(page * size, total);
  
  return (
     <div className="flex items-center justify-between px-2 py-3">
       <p className="text-sm text-muted-foreground">
         Showing <span className="font-medium">{from}</span> to{" "}
         <span className="font-medium">{to}</span> of{" "}
         <span className="font-medium">{total}</span> results
       </p>
       
       <div className="flex items-center gap-1">
         <Button
            variant="outline" size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="h-8 w-8 p-0"
         >
           <ChevronLeft className="w-4 h-4"/>
         </Button>
         
         {/* Page numbers */}
         {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages ||
               Math.abs(p - page) <= 1)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
               p === "..." ? (
                  <span key={`dots-${idx}`} className="px-2 text-muted-foreground text-sm">...</span>
               ) : (
                  <Button
                     key={p}
                     variant={p === page ? "default" : "outline"}
                     size="sm"
                     onClick={() => onPageChange(p)}
                     className="h-8 w-8 p-0"
                  >
                    {p}
                  </Button>
               )
            )
         }
         
         <Button
            variant="outline" size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="h-8 w-8 p-0"
         >
           <ChevronRight className="w-4 h-4"/>
         </Button>
       </div>
     </div>
  );
}