import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="w-28 h-7" />
        <Skeleton className="w-56 h-4" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-nutado-gray-200 p-5">
          <Skeleton className="w-36 h-5 mb-2" />
          <Skeleton className="w-52 h-4 mb-6" />
          <Skeleton className="w-full h-48" />
        </div>
        <div className="bg-white rounded-xl border border-nutado-gray-200 p-5 space-y-4">
          <Skeleton className="w-40 h-5" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-8 h-3" />
              </div>
              <Skeleton className="w-full h-2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
