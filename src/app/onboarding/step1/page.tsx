"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";

const INDUSTRIES = [
  "Technology",
  "Retail",
  "Food & Beverage",
  "Healthcare",
  "Finance & Banking",
  "Education",
  "Manufacturing",
  "Hospitality",
  "Real Estate",
  "Other",
];

const inputCls =
  "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#0a6e3a] focus:outline-none focus:ring-1 focus:ring-[#0a6e3a] transition-colors bg-white";

export default function OnboardingStep1() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [giftBoxes, setGiftBoxes] = useState("");
  const [industryOpen, setIndustryOpen] = useState(false);
  const [savedAt] = useState("8 seconds ago");

  const canProceed = companyName.trim() && contactPerson.trim() && giftBoxes.trim();

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col">
      {/* Stepper */}
      <div className="max-w-[1400px] w-full mx-auto">
        <OnboardingStepper currentStep={1} />
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-8 pb-28 pt-6">
        {/* Page title */}
        <div className="text-center mb-10">
          <h1 className="text-[#0a6e3a] font-bold text-2xl mb-2">
            Tell Us About Your Company
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Let's get started — share your details and we'll craft a gifting experience that speaks your brand's language.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto">

        {/* Card 1: Company & Contact */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4 overflow-hidden">
          <div className="px-6 py-5">
            <p className="text-[#0a6e3a] text-xs font-bold uppercase tracking-widest mb-5">
              Company &amp; Contact
            </p>

            {/* Row: Company Name + Industry */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Pvt. Ltd."
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Industry
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIndustryOpen(!industryOpen)}
                    className={`${inputCls} flex items-center justify-between text-left ${
                      industry ? "text-gray-800" : "text-gray-400"
                    } ${industryOpen ? "border-[#0a6e3a] ring-1 ring-[#0a6e3a]" : ""}`}
                  >
                    <span>{industry || "Select industry"}</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform shrink-0 ${industryOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {industryOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {INDUSTRIES.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => { setIndustry(item); setIndustryOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                            industry === item ? "text-[#0a6e3a] font-semibold bg-green-50" : "text-gray-700"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact Person<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Priya Mehta"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Order Essentials */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5">
            <p className="text-[#0a6e3a] text-xs font-bold uppercase tracking-widest mb-5">
              Order Essentials
            </p>

            <div className="w-1/2 pr-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                No. of Gift Boxes<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="number"
                value={giftBoxes}
                onChange={(e) => setGiftBoxes(e.target.value)}
                placeholder="e.g.100"
                min={1}
                className={inputCls}
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* ── Sticky bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#e05c1a] hover:text-[#c04d10] underline underline-offset-2 transition-colors"
          >
            Cancel
          </Link>
          <span className="text-sm text-gray-400">Draft link saved {savedAt}</span>
        </div>

        <Link
          href="/onboarding/step2"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 ${
            canProceed
              ? "bg-[#1b5e38] hover:bg-[#134529]"
              : "bg-[#1b5e38]/60 pointer-events-none"
          }`}
        >
          Next
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
