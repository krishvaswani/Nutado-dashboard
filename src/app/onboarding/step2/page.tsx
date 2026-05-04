"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { useOnboarding } from "@/context/OnboardingContext";

import birthdaySvg from "@/Assets/Step-2/Birthday.svg";
import eidSvg from "@/Assets/Step-2/EID.svg";
import onamSvg from "@/Assets/Step-2/Onam.svg";
import rakhiSvg from "@/Assets/Step-2/rakhi.svg";
import janmashtamiSvg from "@/Assets/Step-2/janmashtami.svg";
import navratriSvg from "@/Assets/Step-2/Navratri.svg";
import diwaliSvg from "@/Assets/Step-2/Diwali.svg";
import corpAnniversarySvg from "@/Assets/Step-2/corp. anniversary.svg";

const OCCASIONS = [
  { id: "birthday", label: "BIRTHDAY", img: birthdaySvg },
  { id: "eid", label: "EID", img: eidSvg },
  { id: "onam", label: "ONAM", img: onamSvg },
  { id: "rakhi", label: "RAKHI", img: rakhiSvg },
  { id: "janmashtami", label: "JANMASHTAMI", img: janmashtamiSvg },
  { id: "navratri", label: "NAVRATRI", img: navratriSvg },
  { id: "diwali", label: "DIWALI", img: diwaliSvg },
  { id: "corp-anniversary", label: "CORP. ANNIVERSARY", img: corpAnniversarySvg },
];

export default function OnboardingStep2() {
  const { state, update } = useOnboarding();
  const [savedAt] = useState("8 seconds ago");

  const selected = state.occasions[0] ?? "";

  const select = (id: string) => {
    update({ occasions: [id] });
  };

  const canProceed = selected.length > 0;

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col overflow-hidden">
      {/* Stepper */}
      <div className="max-w-[1400px] w-full mx-auto shrink-0">
        <OnboardingStepper currentStep={2} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 max-w-[1400px] w-full mx-auto px-8 pt-3 pb-3 flex flex-col">
        {/* Page title */}
        <div className="text-center mb-3 shrink-0">
          <h1 className="text-[#0a6e3a] font-bold text-xl mb-1">
            What&apos;s the Occassion?
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Every celebration deserves a perfectly tailored gift. Pick your moment — we&apos;ll handle the rest.
          </p>
        </div>

        {/* Grid of occasion cards */}
        <div className="flex-1 min-h-0 grid grid-cols-4 grid-rows-2 gap-4">
          {OCCASIONS.map((occ) => {
            const isSelected = selected === occ.id;
            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => select(occ.id)}
                className={`group bg-white rounded-2xl border-2 transition-all duration-200 p-3 flex flex-col items-center justify-center min-h-0 ${
                  isSelected
                    ? "border-[#0a6e3a] bg-[#f0f9f4] shadow-sm"
                    : "border-transparent shadow-sm hover:border-gray-200"
                }`}
              >
                <div className="flex-1 min-h-0 flex items-center justify-center w-full">
                  <Image
                    src={occ.img}
                    alt={occ.label}
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <span className="text-[#0a6e3a] font-bold text-sm tracking-wide mt-2 shrink-0">
                  {occ.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white border-t border-gray-200 shrink-0">
        <div className="max-w-[1400px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-[#e05c1a] hover:text-[#c04d10] underline underline-offset-2 transition-colors"
            >
              Cancel
            </Link>
            <span className="text-sm text-gray-400">Draft link saved {savedAt}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding/step1"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </Link>
            <Link
              href="/onboarding/step3"
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 ${
                canProceed
                  ? "bg-[#1b5e38] hover:bg-[#134529]"
                  : "bg-[#1b5e38]/60 pointer-events-none"
              }`}
            >
              Next
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
