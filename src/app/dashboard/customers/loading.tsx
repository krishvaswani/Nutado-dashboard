import { Skeleton } from "@/components/ui/Skeleton";

export default function CustomersLoading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="w-32 h-7" />
          <Skeleton className="w-40 h-4" />
        </div>
        <Skeleton className="w-36 h-9 rounded-lg" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-nutado-gray-200 p-4 text-center">
            <Skeleton className="w-12 h-7 mx-auto mb-2" />
            <Skeleton className="w-20 h-3 mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-nutado-gray-200 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-11 h-11 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-28 h-4" />
                <Skeleton className="w-20 h-3" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-3/4 h-3" />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-nutado-gray-100">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="text-center space-y-1">
                  <Skeleton className="w-10 h-4 mx-auto" />
                  <Skeleton className="w-8 h-3 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
