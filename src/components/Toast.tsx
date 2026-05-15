import type { ToastState, ToastType } from "./useToast";

export default function Toast({ toast }: { toast: ToastState | null }) {
  const colors: Record<ToastType, string> = {
    success: "bg-emerald-600/90 text-white",
    error: "bg-red-600/90 text-white",
    info: "bg-surface/90 text-on-surface",
  };

  if (!toast) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
      style={{ animation: "toastIn 0.3s ease-out" }}
    >
      <div className={`px-6 py-3 rounded-full shadow-lg text-sm font-bold backdrop-blur-md ${colors[toast.type]}`}>
        {toast.message}
      </div>
    </div>
  );
}
