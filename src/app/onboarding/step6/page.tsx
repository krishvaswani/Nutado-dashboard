"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Sparkles, Handshake } from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import OnboardingDraftStatus from "@/components/onboarding/OnboardingDraftStatus";

type TemplateId = "warm-festive" | "professional-1" | "professional-2" | "gift-card";

const TEMPLATES: {
  id: TemplateId;
  message: string;
}[] = [
  {
    id: "warm-festive",
    message:
      "Wishing you joy and abundance this festive season. With heartfelt gratitude...",
  },
  {
    id: "professional-1",
    message:
      "On behalf of [Company], we extend our warmest appreciation for your continued partnership.",
  },
  {
    id: "professional-2",
    message:
      "Thank you for your trust and support. We’re delighted to send this gift on behalf of our team.",
  },
  { id: "gift-card", message: "" },
];

export default function OnboardingStep6() {
  const { state, update } = useOnboarding();
  const { profile } = useAuth();

  const selectedTemplate = (state.messageTemplate as TemplateId) || "warm-festive";
  const message =
    state.message ||
    "Wishing you joy and abundance this festive season. With heartfelt gratitude...";
  const homeHref = profile?.role === "client" ? "/user-dashboard" : "/dashboard";

  const pickTemplate = (id: TemplateId) => {
    const template = TEMPLATES.find((entry) => entry.id === id);
    update({
      messageTemplate: id,
      message: template?.message ?? state.message,
    });
  };

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto shrink-0">
        <OnboardingStepper currentStep={6} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[1400px] w-full mx-auto px-8 pt-3 pb-6">
          <div className="text-center mb-6">
            <h2 className="text-[#ec2626] font-bold text-xl mb-2">
              Add Branding &amp; Message
            </h2>
            <p className="text-gray-500 text-sm">
              This is what personalizes the box before the order is submitted into Firebase.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-[#ec2626] font-bold text-sm uppercase tracking-wide mb-5">
              Message Card Templates
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <button
                type="button"
                onClick={() => pickTemplate("warm-festive")}
                className={`relative rounded-2xl overflow-hidden aspect-[16/9] text-left transition-all ${
                  selectedTemplate === "warm-festive"
                    ? "ring-2 ring-[#ec2626] ring-offset-2"
                    : ""
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, #fef3d7 0%, #fde9b8 50%, #fef3d7 100%)",
                  border: "2px solid #e9c876",
                }}
              >
                <div className="absolute top-2 left-2 text-amber-500/70 text-3xl leading-none select-none">
                  ❀
                </div>
                <div className="absolute bottom-2 right-2 text-amber-500/70 text-3xl leading-none select-none">
                  ❀
                </div>
                <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
                  <div className="font-display font-bold text-lg text-gray-800 mb-2">
                    Warm Festive
                  </div>
                  <div className="flex items-start gap-1 text-[12px] text-gray-700 leading-snug">
                    <Sparkles size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    <span className="italic">
                      Wishing you joy and abundance this festive season. With heartfelt gratitude...
                    </span>
                  </div>
                </div>
              </button>

              {(["professional-1", "professional-2"] as TemplateId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => pickTemplate(id)}
                  className={`relative rounded-2xl bg-[#f3f1ec] aspect-[16/9] p-5 text-left transition-all ${
                    selectedTemplate === id
                      ? "ring-2 ring-[#ec2626] ring-offset-2"
                      : ""
                  }`}
                >
                  <span className="absolute top-0 right-0 w-5 h-5 bg-gray-400/60 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
                  <span className="absolute bottom-0 left-0 w-5 h-5 bg-gray-400/60 [clip-path:polygon(0_100%,100%_100%,0_0)]" />
                  <div className="flex items-start gap-3 h-full">
                    <div className="w-12 h-12 rounded-full bg-[#0d2a4f] flex items-center justify-center shrink-0 mt-1">
                      <Handshake size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-base text-gray-800 mb-1">
                        Professional
                      </div>
                      <p className="text-[11px] text-gray-600 leading-snug">
                        {TEMPLATES.find((entry) => entry.id === id)?.message}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#ec2626] font-bold text-sm uppercase tracking-wide mb-4">
              Your Personal Message
            </h3>

            <textarea
              value={message}
              onChange={(e) => update({ message: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#ec2626] resize-none mb-5"
              placeholder="Write your message..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo on Box?
                </label>
                <div className="relative">
                  <select
                    value={state.logoChoice || "Yes - share logo after submission"}
                    onChange={(e) => update({ logoChoice: e.target.value })}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#ec2626] pr-10"
                  >
                    <option>Yes - share logo after submission</option>
                    <option>No</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ribbon / Packaging Theme
                </label>
                <div className="relative">
                  <select
                    value={state.ribbonTheme || "Gold (Signature)"}
                    onChange={(e) => update({ ribbonTheme: e.target.value })}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#ec2626] pr-10"
                  >
                    <option>Gold (Signature)</option>
                    <option>Silver</option>
                    <option>Red</option>
                    <option>Green</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 shrink-0">
        <div className="max-w-[1400px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={homeHref}
              className="text-sm font-semibold text-[#e05c1a] hover:text-[#c04d10] underline underline-offset-2 transition-colors"
            >
              Cancel
            </Link>
            <OnboardingDraftStatus />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding/step3"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </Link>
            <Link
              href="/onboarding/step7"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm text-white bg-[#b91c1c] hover:bg-[#7c0404] transition-colors"
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
