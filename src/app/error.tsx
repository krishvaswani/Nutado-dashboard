"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-nutado-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">😵</div>
        <h1 className="font-display font-bold text-3xl text-nutado-gray-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-nutado-gray-500 mb-8">
          An unexpected error occurred. Please try again or return to the dashboard.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/dashboard" className="btn-secondary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
