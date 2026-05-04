import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="w-28 h-7" />
          <Skeleton className="w-40 h-4" />
        </div>
        <Skeleton className="w-32 h-9 rounded-lg" />
      </div>
      <div className="bg-white rounded-xl border border-nutado-gray-200 p-4 flex gap-3">
        <Skeleton className="flex-1 h-10 rounded-lg" />
        <Skeleton className="w-72 h-10 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-nutado-gray-200 overflow-hidden">
            <Skeleton className="w-full aspect-square rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-3" />
              <Skeleton className="w-20 h-5 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
