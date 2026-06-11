"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NEXT_STEPS = [
  "The order is now available inside the client dashboard",
  "The same order is also visible inside the company dashboard",
  "Operations can update status, pricing, and invoice details",
  "Clients can revisit the record and download their documents later",
  "Future automation like invoice PDFs can be attached to the same order",
];

export default function OnboardingStep8() {
  const searchParams = useSearchParams();
  const { profile } = useAuth();

  const reference = useMemo(() => {
    return searchParams.get("reference") || `CST-${new Date().getFullYear()}-PENDING`;
  }, [searchParams]);

  const dashboardHref = profile?.role === "client" ? "/user-dashboard" : "/dashboard";

  function downloadSummary() {
    const lines = [
      "Consuetudo Order Summary",
      `Reference: ${reference}`,
      `Order Id: ${searchParams.get("order") || "pending"}`,
      `Created For: ${profile?.company || "Consuetudo Client"}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `${reference}.txt`;
    link.click();
    URL.revokeObjectURL(href);
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col">
      <div className="flex-1 flex items-start justify-center px-4 pt-12 pb-8">
        <div className="w-full max-w-xl">
          <div className="flex justify-center mb-5">
            <div className="w-28 h-28 rounded-full border-[3px] border-[#ec2626] flex items-center justify-center">
              <Check
                size={64}
                strokeWidth={3}
                className="text-[#ec2626]"
              />
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">
            Order Saved Successfully
          </h1>
          <p className="text-center text-sm text-gray-500 mb-5 max-w-md mx-auto">
            Your order has been written to Firebase and is ready for both client-side tracking and employee-side processing.
          </p>

          <div className="flex justify-center mb-8">
            <div className="bg-[#fff5f5] border border-[#ec2626]/40 rounded-lg px-8 py-3 font-mono text-[#ec2626] font-bold tracking-[0.2em] text-base">
              {reference}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-gray-700 font-medium text-base mb-4">
              What Happens Next
            </h3>
            <ol className="space-y-3">
              {NEXT_STEPS.map((step, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#ec2626] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-800">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <Link
              href="/onboarding/step1"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-white bg-[#b91c1c] hover:bg-[#7c0404] transition-colors"
            >
              Place Another Order
            </Link>
            <button
              type="button"
              onClick={downloadSummary}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Download Summary
            </button>
            <Link
              href={dashboardHref}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-[#ec2626] bg-white border border-[#ec2626] hover:bg-[#fff5f5] transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500">
            Reference {reference}
          </p>
        </div>
      </div>
    </div>
  );
}
