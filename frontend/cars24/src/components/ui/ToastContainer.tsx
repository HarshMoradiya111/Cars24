"use client";
import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, Bell } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "notification";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    case "notification":
      return <Bell className="h-5 w-5 text-blue-600" />;
    case "info":
    default:
      return <Info className="h-5 w-5 text-blue-600" />;
  }
};

const toastStyles: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200 text-green-900",
  error: "bg-red-50 border-red-200 text-red-900",
  info: "bg-blue-50 border-blue-200 text-blue-900",
  notification: "bg-purple-50 border-purple-200 text-purple-900",
};

const ToastItem: React.FC<{
  toast: Toast;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(
      () => onRemove(toast.id),
      toast.duration || 5000
    );
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${toastStyles[toast.type]} animate-slideIn`}
    >
      <ToastIcon type={toast.type} />
      <div className="flex-1">
        <h4 className="font-semibold">{toast.title}</h4>
        <p className="text-sm mt-1">{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              onRemove(toast.id);
            }}
            className="text-sm font-medium underline mt-2 hover:opacity-75"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Toast hook for using toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (title: string, message: string) => {
    addToast({ type: "success", title, message });
  };

  const error = (title: string, message: string) => {
    addToast({ type: "error", title, message });
  };

  const info = (title: string, message: string) => {
    addToast({ type: "info", title, message });
  };

  const notification = (title: string, message: string) => {
    addToast({ type: "notification", title, message });
  };

  return { toasts, addToast, removeToast, success, error, info, notification };
};
