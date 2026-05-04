import { StatCardSkeleton, Skeleton, TableRowSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-48 h-4" />
        </div>
        <Skeleton className="w-32 h-10 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-nutado-gray-200 p-5 shadow-card">
          <Skeleton className="w-40 h-5 mb-2" />
          <Skeleton className="w-56 h-4 mb-6" />
          <Skeleton className="w-full h-40" />
        </div>
        <div className="bg-white rounded-xl border border-nutado-gray-200 p-5 shadow-card space-y-4">
          <Skeleton className="w-32 h-5" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-nutado-gray-100">
          <Skeleton className="w-36 h-5" />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200">
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-5 py-3">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-nutado-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={6} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
