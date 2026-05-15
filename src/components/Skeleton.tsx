export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-surface-container-high rounded-xl relative overflow-hidden ${className || ""}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-surface-container-highest">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 lg:p-6 space-y-3">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-5 w-40" />
        <div className="flex justify-between items-center flex-row-reverse pt-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div className="flex items-center gap-4 flex-row-reverse">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-4 flex-row-reverse">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ContactSkeleton() {
  return (
    <div className="bg-surface rounded-xl border border-surface-container-highest overflow-hidden p-4 lg:p-6">
      <div className="flex items-start gap-4 flex-row-reverse">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center flex-row-reverse">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-surface-container-highest">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 px-6">
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center gap-3 flex-row-reverse flex-1">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}
