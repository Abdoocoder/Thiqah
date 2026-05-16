import { useRef, useEffect, type ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      destructive ? confirmRef.current?.focus() : cancelRef.current?.focus();
    }
  }, [open, destructive]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onCancel(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className="relative bg-surface rounded-2xl border border-surface-container-highest p-8 max-w-md w-full shadow-xl text-right"
        style={{ animation: "modalIn 250ms ease-out forwards" }}
      >
        <div className="flex items-center gap-3 mb-6 flex-row-reverse">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${destructive ? "bg-error-container text-error" : "bg-primary/10 text-primary"}`}>
            <AlertTriangle size={24} />
          </div>
          <h3 id="confirm-title" className="text-xl font-bold">{title}</h3>
        </div>
        <div className="text-on-surface-variant text-sm mb-8 leading-relaxed">
          {message}
        </div>
        <div className="flex gap-4 flex-row-reverse">
          <button
            ref={destructive ? confirmRef : cancelRef}
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest active:scale-[0.98] focus-visible:ring-2 focus-visible:outline-none transition duration-150 ${
              destructive
                ? "bg-error text-on-inverse hover:bg-error/90 focus-visible:ring-error/40"
                : "bg-inverse-surface text-on-inverse hover:bg-primary focus-visible:ring-primary/40"
            }`}
          >
            {confirmLabel}
          </button>
          <button
            ref={destructive ? cancelRef : confirmRef}
            onClick={onCancel}
            className="px-6 py-3 rounded-full border border-outline text-xs font-bold uppercase tracking-widest hover:bg-surface-variant active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150"
          >
            {cancelLabel}
          </button>
        </div>
        <button
          onClick={onCancel}
          aria-label="إغلاق"
          className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant active:scale-[0.92] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
