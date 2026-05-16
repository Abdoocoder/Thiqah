import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  current,
  total,
  pageSize,
  onChange,
}: {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  return (
    <div className="overflow-x-auto pb-2"><div className="flex items-center justify-center gap-2 pt-6 flex-nowrap" dir="ltr">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current <= 1}
        aria-label="الصفحة السابقة"
        className="w-11 h-11 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant active:scale-[0.92] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        <ChevronRight size={16} />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-label={`الصفحة ${p}`}
          aria-current={p === current ? "page" : undefined}
          className={`w-11 h-11 rounded-full text-sm font-bold active:scale-[0.92] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150 ${
            p === current
              ? "bg-inverse-surface text-on-inverse"
              : "text-on-surface-variant hover:bg-surface-variant"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(pages, current + 1))}
        disabled={current >= pages}
        aria-label="الصفحة التالية"
        className="w-11 h-11 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant active:scale-[0.92] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        <ChevronLeft size={16} />
      </button>
    </div></div>
  );
}
