import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className = "" }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-nutado-green ${className}`}
    />
  );
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-nutado-gray-50">
      <div className="w-12 h-12 bg-nutado-green rounded-xl flex items-center justify-center shadow-elevated">
        <span className="text-white font-display font-bold text-xl">N</span>
      </div>
      <div className="flex items-center gap-2">
        <Spinner size={18} />
        <span className="text-sm text-nutado-gray-500 font-medium">{message}</span>
      </div>
    </div>
  );
}
