import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

const STATUS_STYLES = {
  ACTIVE: "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  INACTIVE: "bg-gray-100   text-gray-600   dark:bg-gray-800      dark:text-gray-400",
  PRESENT: "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  ABSENT: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
  LATE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  HALF_DAY: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  PAID: "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  OVERDUE: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
  PARTIAL: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  APPROVED: "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  REJECTED: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
  ISSUED: "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  RETURNED: "bg-gray-100   text-gray-600   dark:bg-gray-800      dark:text-gray-400",
  PASS: "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  FAIL: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
  OPEN: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
  RESOLVED: "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
};

export default function StatusBadge ({ status, className }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
  return (
     <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        style, className
     )}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}