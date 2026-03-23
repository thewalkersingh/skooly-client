import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
};

export default function ToastContainer ({ toasts }) {
  if (!toasts.length) return null;
  
  return (
     <div className="toast-container">
       {toasts.map(({ id, message, type }) => {
         const Icon = ICONS[type] || CheckCircle;
         return (
            <div key={id} className={`toast ${type}`}>
              <Icon style={{ width: 18, height: 18, flexShrink: 0 }}/>
              <span>{message}</span>
            </div>
         );
       })}
     </div>
  );
}