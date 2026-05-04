import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-nutado-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Big emoji */}
        <div className="text-8xl mb-6">🥜</div>

        {/* Headline */}
        <h1 className="font-display font-bold text-4xl text-nutado-gray-900 mb-3">
          404 — Page Not Found
        </h1>
        <p className="text-nutado-gray-500 text-base mb-8 leading-relaxed">
          Looks like this snack got lost in transit! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
          <Link href="/login" className="btn-secondary">
            Back to Login
          </Link>
        </div>

        {/* Logo */}
        <div className="mt-10 flex items-center justify-center gap-2 opacity-40">
          <div className="w-6 h-6 bg-nutado-green rounded-md flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">N</span>
          </div>
          <span className="font-display font-semibold text-sm text-nutado-gray-600">Nutado</span>
        </div>
      </div>
    </div>
  );
}
