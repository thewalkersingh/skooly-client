import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export default function ConfirmDialog ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "destructive",
  isLoading = false,
  onConfirm,
}) {
  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-sm">
         <DialogHeader>
           <DialogTitle>{title}</DialogTitle>
           <DialogDescription>{description}</DialogDescription>
         </DialogHeader>
         <DialogFooter className="gap-2 sm:gap-0">
           <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
           >
             {cancelLabel}
           </Button>
           <Button
              variant={variant}
              onClick={onConfirm}
              disabled={isLoading}
           >
             {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
             {confirmLabel}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
  );
}