import { Spinner } from "@/components/ui/Spinner";

export default function OnboardingLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <Spinner size={32} />
        <p className="text-sm text-nutado-gray-500 font-medium">Loading step…</p>
      </div>
    </div>
  );
}
