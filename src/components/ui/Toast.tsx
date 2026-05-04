"use client";

import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import type { Toast, ToastType } from "@/hooks/useToast";

const CONFIG: Record<ToastType, { icon: typeof CheckCircle; bg: string; text: string; border: string }> = {
  success: { icon: CheckCircle, bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
  error:   { icon: XCircle,     bg: "bg-red-50",   text: "text-red-800",   border: "border-red-200" },
  info:    { icon: Info,        bg: "bg-blue-50",  text: "text-blue-800",  border: "border-blue-200" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const { icon: Icon, bg, text, border } = CONFIG[toast.type];
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-elevated ${bg} ${border} animate-slide-in-right`}>
      <Icon size={16} className={`flex-shrink-0 mt-0.5 ${text}`} />
      <span className={`text-sm font-medium flex-1 ${text}`}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className={`flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ${text}`}
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
