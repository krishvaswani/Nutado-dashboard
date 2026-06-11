"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Global boundary caught error:", error);
    // Automatically redirect to dashboard
    router.replace("/dashboard");
  }, [error, router]);

  return (
    <div className="min-h-screen bg-nutado-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-pulse">🔄</div>
        <h1 className="font-display font-bold text-2xl text-nutado-gray-900 mb-3">
          Redirecting to Dashboard...
        </h1>
        <p className="text-nutado-gray-500">
          An unexpected error occurred. We are redirecting you back to safety.
        </p>
      </div>
    </div>
  );
}
