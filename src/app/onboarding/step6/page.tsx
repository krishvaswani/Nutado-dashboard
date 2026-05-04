"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Sparkles, Handshake } from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { useOnboarding } from "@/context/OnboardingContext";

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
      "On behalf of [Company], we extend our warmest appreciation for your continued partnership.",
  },
  { id: "gift-card", message: "" },
];

export default function OnboardingStep6() {
  const { state, update } = useOnboarding();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("warm-festive");
  const [message, setMessage] = useState<string>(
    "Wishing you joy and abundance this festive season. With heartfelt gratitude..."
  );
  const [logoChoice, setLogoChoice] = useState("Yes - share logo after submission");
  const [ribbonTheme, setRibbonTheme] = useState("Gold (Signature)");
  const [savedAt] = useState("8 seconds ago");

  const pickTemplate = (id: TemplateId) => {
    setSelectedTemplate(id);
    const t = TEMPLATES.find((t) => t.id === id);
    if (t && t.message) setMessage(t.message);
  };

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto shrink-0">
        <OnboardingStepper currentStep={6} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[1400px] w-full mx-auto px-8 pt-3 pb-6">
          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-[#0a6e3a] font-bold text-xl mb-2">
              Say It With Heart
            </h2>
            <p className="text-gray-500 text-sm">
              A thoughtful note transforms every gift into a memory. Choose a template or pour your own words.
            </p>
          </div>

          {/* Templates panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-[#0a6e3a] font-bold text-sm uppercase tracking-wide mb-5">
              Message Card Templates
            </h3>
            <div className="grid grid-cols-3 gap-5">
              {/* Warm Festive */}
              <button
                type="button"
                onClick={() => pickTemplate("warm-festive")}
                className={`relative rounded-2xl overflow-hidden aspect-[16/9] text-left transition-all ${
                  selectedTemplate === "warm-festive"
                    ? "ring-2 ring-[#0a6e3a] ring-offset-2"
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

              {/* Professional 1 */}
              {(["professional-1", "professional-2"] as TemplateId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => pickTemplate(id)}
                  className={`relative rounded-2xl bg-[#f3f1ec] aspect-[16/9] p-5 text-left transition-all ${
                    selectedTemplate === id
                      ? "ring-2 ring-[#0a6e3a] ring-offset-2"
                      : ""
                  }`}
                >
                  {/* corner triangles */}
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
                        On behalf of [Company], we extend our warmest appreciation for your continued partnership.
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              {/* Gift Card */}
              <button
                type="button"
                onClick={() => pickTemplate("gift-card")}
                className={`relative rounded-2xl overflow-hidden aspect-[16/9] flex transition-all ${
                  selectedTemplate === "gift-card"
                    ? "ring-2 ring-[#0a6e3a] ring-offset-2"
                    : ""
                }`}
              >
                <div className="w-2/5 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative flex items-center justify-center">
                  <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_30%_50%,#facc15_0%,transparent_60%)]" />
                  <div className="relative w-3 h-full bg-red-600" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-red-600 shadow-lg" />
                </div>
                <div className="flex-1 bg-white flex items-center justify-center">
                  <div className="text-center font-display font-bold text-xl text-gray-700 leading-tight">
                    GIFT
                    <br />
                    CARD
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Personal message panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#0a6e3a] font-bold text-sm uppercase tracking-wide mb-4">
              Your Personal Message
            </h3>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0a6e3a] resize-none mb-5"
              placeholder="Write your message..."
            />

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo on Box?
                </label>
                <div className="relative">
                  <select
                    value={logoChoice}
                    onChange={(e) => setLogoChoice(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#0a6e3a] pr-10"
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
                    value={ribbonTheme}
                    onChange={(e) => setRibbonTheme(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#0a6e3a] pr-10"
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
              href="/onboarding/step5"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </Link>
            <Link
              href="/onboarding/step7"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm text-white bg-[#1b5e38] hover:bg-[#134529] transition-colors"
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
