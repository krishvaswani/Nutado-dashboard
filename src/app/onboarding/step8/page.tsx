"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Check } from "lucide-react";

const NEXT_STEPS = [
  "PDF quote arrives in your inbox within minutes",
  "Dedicated relationship manager calls within 4 hours",
  "Mood board & sample box shared for your approval",
  "Production begins after your sign-off",
  "End-to-end tracked delivery to every recipient",
];

export default function OnboardingStep8() {
  const reference = useMemo(() => {
    const n = Math.floor(100000 + Math.random() * 900000);
    return `ENQ-2026-${n}`;
  }, []);

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col">
      <div className="flex-1 flex items-start justify-center px-4 pt-12 pb-8">
        <div className="w-full max-w-xl">
          {/* Check icon */}
          <div className="flex justify-center mb-5">
            <div className="w-28 h-28 rounded-full border-[3px] border-[#0a6e3a] flex items-center justify-center">
              <Check
                size={64}
                strokeWidth={3}
                className="text-[#0a6e3a]"
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">
            Enquiry Submitted!
          </h1>
          <p className="text-center text-sm text-gray-500 mb-5 max-w-md mx-auto">
            Your gifting brief is with our team. A detailed PDF quote will be in your inbox shortly.
          </p>

          {/* Reference badge */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#f0f9f4] border border-[#0a6e3a]/40 rounded-lg px-8 py-3 font-mono text-[#0a6e3a] font-bold tracking-[0.2em] text-base">
              {reference}
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-gray-700 font-medium text-base mb-4">
              What Happens Next
            </h3>
            <ol className="space-y-3">
              {NEXT_STEPS.map((step, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#0a6e3a] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-800">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <Link
              href="/onboarding/step1"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-white bg-[#0a4f1f] hover:bg-[#073a16] transition-colors"
            >
              Place Another Enquiry
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Download Summary
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-[#0a6e3a] bg-white border border-[#0a6e3a] hover:bg-[#f0f9f4] transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500">
            Enquiry confirmation sent to. Reference {reference}
          </p>
        </div>
      </div>
    </div>
  );
}
