import { Skeleton, TableRowSkeleton } from "@/components/ui/Skeleton";

export default function OrdersLoading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="w-24 h-7" />
          <Skeleton className="w-32 h-4" />
        </div>
        <Skeleton className="w-24 h-9 rounded-lg" />
      </div>
      <div className="bg-white rounded-xl border border-nutado-gray-200 p-4 flex gap-3">
        <Skeleton className="flex-1 h-10 rounded-lg" />
        <Skeleton className="w-64 h-10 rounded-lg" />
      </div>
      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200">
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="px-5 py-3">
                  <Skeleton className="h-3 w-14" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-nutado-gray-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={8} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
