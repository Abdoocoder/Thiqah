import type { ToastState, ToastType } from "./useToast";
import { Check, X, Info } from "lucide-react";
import type { ReactNode } from "react";

const colors: Record<ToastType, string> = {
  success: "bg-success text-on-inverse",
  error: "bg-error text-on-inverse",
  info: "bg-surface/90 text-on-surface",
};

const icons: Record<ToastType, ReactNode> = {
  success: <Check size={16} className="shrink-0 animate-[scaleIn_200ms_ease-out]" />,
  error: <X size={16} className="shrink-0" />,
  info: <Info size={16} className="shrink-0" />,
};

export default function Toast({ toast }: { toast: ToastState | null }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div
        role="alert"
        className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg text-sm font-bold backdrop-blur-md transition-[transform,opacity] duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          toast
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0"
        } ${toast ? colors[toast.type] : colors.success}`}
      >
        {toast && icons[toast.type]}
        {toast?.message}
      </div>
    </div>
  );
}
