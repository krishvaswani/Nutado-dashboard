export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-nutado-gray-200 rounded-lg ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-nutado-gray-200 p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-24 h-7 mb-2" />
      <Skeleton className="w-32 h-4" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className={`h-4 ${i === 0 ? "w-32" : i === cols - 1 ? "w-16" : "w-24"}`} />
          {i === 0 && <Skeleton className="w-20 h-3 mt-1.5" />}
        </td>
      ))}
    </tr>
  );
}
