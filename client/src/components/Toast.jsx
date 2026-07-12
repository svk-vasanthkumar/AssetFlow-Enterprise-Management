import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const typeConfig = {
  success: { icon: CheckCircle, className: 'toast-success' },
  error: { icon: AlertCircle, className: 'toast-error' },
  warning: { icon: AlertTriangle, className: 'toast-warning' },
  info: { icon: Info, className: 'toast-info' },
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type] || typeConfig.info;
        const Icon = config.icon;
        return (
          <div key={toast.id} className={`toast ${config.className}`}>
            <Icon size={18} className="toast-icon" />
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
