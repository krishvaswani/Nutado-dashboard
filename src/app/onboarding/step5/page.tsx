"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";

import box1 from "@/Assets/Slide3/box1.png";

const PRODUCT_COUNT = 8;

function ProductPouch() {
  return (
    <div className="w-full h-full flex items-end justify-center gap-0.5 p-1">
      <div className="w-1/2 h-full rounded-sm bg-blue-500" />
      <div className="w-1/2 h-full rounded-sm bg-yellow-300" />
    </div>
  );
}

export default function OnboardingStep5() {
  const [savedAt] = useState("8 seconds ago");

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto shrink-0">
        <OnboardingStepper currentStep={7} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[1400px] w-full mx-auto px-8 pt-3 pb-6">
          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-[#0a6e3a] font-bold text-xl mb-2">
              Almost There — Review &amp; Confirm
            </h2>
            <p className="text-gray-500 text-sm">
              Take a final look at your gifting brief. Once confirmed, our team gets to work immediately.
            </p>
          </div>

          {/* Enquiry Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
            <h3 className="text-[#0a6e3a] font-bold text-sm uppercase tracking-wide mb-5">
              Enquiry Summary — Nutado Corporate Gifting
            </h3>

            <div className="divide-y divide-gray-100">
              {/* Occasion */}
              <div className="flex items-center justify-between py-4">
                <span className="text-gray-800 text-sm">Occasion</span>
                <span className="text-[#0a6e3a] font-semibold text-sm">Navratri</span>
              </div>

              {/* Box Type */}
              <div className="py-4">
                <div className="text-gray-800 text-sm mb-3">Box Type</div>
                <div className="inline-flex items-center gap-3 border border-gray-200 rounded-xl p-2 pr-6">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    <Image
                      src={box1}
                      alt="Box No 1"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span className="text-gray-800 font-medium text-sm">BOX NO 1</span>
                </div>
              </div>

              {/* Box Capacity */}
              <div className="flex items-center justify-between py-4">
                <span className="text-gray-800 text-sm">Box Capacity</span>
                <span className="text-[#0a6e3a] font-semibold text-sm">8 products</span>
              </div>

              {/* Products */}
              <div className="py-4">
                <div className="text-gray-800 text-sm mb-3">Products</div>
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: PRODUCT_COUNT }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-lg p-2 flex items-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-md bg-gray-50 flex-shrink-0">
                        <ProductPouch />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700 leading-tight">
                        ROASTED &amp; SALTED ALMONDS
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between py-4">
                <span className="text-gray-800 text-sm">Quantity</span>
                <span className="text-[#0a6e3a] font-semibold text-sm">62 boxes</span>
              </div>

              {/* Gift Card */}
              <div className="flex items-center justify-between py-4">
                <span className="text-gray-800 text-sm">Gift Card</span>
                <span className="text-[#0a6e3a] font-semibold text-sm">Festive Crimson</span>
              </div>

              {/* Message */}
              <div className="flex items-center justify-between py-4">
                <span className="text-gray-800 text-sm">Message</span>
                <span className="text-[#0a6e3a] font-semibold text-sm text-right max-w-[60%] truncate">
                  &ldquo;Wishing you joy and abundance this festive season. With hear...&rdquo;
                </span>
              </div>

              {/* Packaging */}
              <div className="flex items-center justify-between py-4">
                <span className="text-gray-800 text-sm">Packaging</span>
                <span className="text-[#0a6e3a] font-semibold text-sm">Gold (Signature)</span>
              </div>
            </div>
          </div>

          {/* Gift Card panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#0a6e3a] font-bold text-sm uppercase tracking-wide mb-5">
              Enquiry Summary — Nutado Corporate Gifting
            </h3>
            <div className="flex items-center gap-5">
              {/* Mini gift card visual */}
              <div className="relative w-[180px] h-[110px] rounded-lg overflow-hidden flex shrink-0 shadow-sm">
                <div className="w-2/5 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative flex items-center justify-center">
                  <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_30%_50%,#facc15_0%,transparent_60%)]" />
                  <div className="relative w-2.5 h-full bg-red-600" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-red-600 shadow-md" />
                </div>
                <div className="flex-1 bg-white flex items-center justify-center">
                  <div className="text-center font-display font-bold text-base text-gray-700 leading-tight">
                    GIFT
                    <br />
                    CARD
                  </div>
                </div>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-base mb-1">
                  Festive Crimson{" "}
                  <span className="font-normal text-gray-700">— Auto-matched for Navratri</span>
                </div>
                <p className="text-sm text-gray-500">
                  Selected based on your Navratri occasion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="bg-white border-t border-gray-200 shrink-0">
        <div className="max-w-[1400px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-[#e05c1a] hover:text-[#c04d10] underline underline-offset-2 transition-colors"
            >
              Cancel
            </Link>
            <span className="text-sm text-gray-400">
              Draft link saved {savedAt}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding/step4"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </Link>
            <Link
              href="/onboarding/step8"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm text-white bg-[#1b5e38] hover:bg-[#134529] transition-colors"
            >
              Submit Inquiry
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
