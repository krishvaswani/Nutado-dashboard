"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  PartyPopper,
  Sparkles,
  Gift,
  Star,
  Cake,
  Flame,
  Calendar,
} from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import { subscribeOccasions } from "@/lib/firebase/firestore";
import OnboardingDraftStatus from "@/components/onboarding/OnboardingDraftStatus";

const ICON_MAP: Record<string, any> = {
  Heart,
  ShoppingBag,
  PartyPopper,
  Sparkles,
  Gift,
  Star,
  Cake,
  Flame,
  Calendar,
};

const COLOR_MAP: Record<string, string> = {
  pink: "from-pink-500 to-rose-400 bg-pink-50/50 border-pink-100 text-pink-600",
  blue: "from-blue-500 to-indigo-400 bg-blue-50/50 border-blue-100 text-blue-600",
  amber: "from-amber-500 to-orange-400 bg-amber-50/50 border-amber-100 text-amber-600",
  purple: "from-violet-500 to-purple-400 bg-purple-50/50 border-purple-100 text-purple-600",
  emerald: "from-emerald-500 to-teal-400 bg-emerald-50/50 border-emerald-100 text-emerald-600",
  red: "from-red-500 to-rose-500 bg-rose-50/50 border-rose-100 text-rose-600",
};

import birthdaySvg from "@/Assets/Step-2/Birthday.svg";
import eidSvg from "@/Assets/Step-2/EID.svg";
import onamSvg from "@/Assets/Step-2/Onam.svg";
import rakhiSvg from "@/Assets/Step-2/rakhi.svg";
import janmashtamiSvg from "@/Assets/Step-2/janmashtami.svg";
import navratriSvg from "@/Assets/Step-2/Navratri.svg";
import diwaliSvg from "@/Assets/Step-2/Diwali.svg";
import corpAnniversarySvg from "@/Assets/Step-2/corp. anniversary.svg";

const SVG_MAP: Record<string, any> = {
  birthday: birthdaySvg,
  eid: eidSvg,
  onam: onamSvg,
  rakhi: rakhiSvg,
  janmashtami: janmashtamiSvg,
  navratri: navratriSvg,
  diwali: diwaliSvg,
  "corp-anniversary": corpAnniversarySvg,
};

const CATEGORIES = [
  { id: "all", label: "All Moments" },
  { id: "festivals", label: "Traditional Festivals" },
  { id: "corporate", label: "Corporate & Milestones" },
  { id: "gifting", label: "Gifting & Special Days" },
];

export default function OnboardingStep2() {
  const { state, update } = useOnboarding();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [customOccasionText, setCustomOccasionText] = useState("");
  const [occasionsList, setOccasionsList] = useState<any[]>([]);

  const selected = state.occasions[0] ?? "";

  // Subscribe to real-time custom occasions from admin dashboard
  useEffect(() => {
    const unsub = subscribeOccasions((list) => {
      const mapped = list.map((item) => {
        const iconComponent = ICON_MAP[item.icon] || Sparkles;
        const colorClasses = COLOR_MAP[item.color] || COLOR_MAP.purple;
        return {
          id: item.id,
          label: item.label.toUpperCase(),
          icon: iconComponent,
          category: item.category || "gifting",
          color: colorClasses,
          img: SVG_MAP[item.id] || item.img || null,
        };
      });
      setOccasionsList(mapped);
    });
    return () => unsub();
  }, []);

  // Pre-fill custom occasion text if loaded from context
  useEffect(() => {
    if (selected && !occasionsList.some((o) => o.id === selected)) {
      setCustomOccasionText(selected);
    }
  }, [selected, occasionsList]);

  const select = (id: string) => {
    update({ occasions: [id] });
  };

  const filteredOccasions = occasionsList.filter(
    (occ) => activeTab === "all" || occ.category === activeTab
  );

  const isCustomActive =
    selected === "custom-occasion" || (selected && !occasionsList.some((o) => o.id === selected));

  const canProceed = selected.length > 0;
  const homeHref = profile?.role === "client" ? "/user-dashboard" : "/dashboard";

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col overflow-hidden">
      {/* Stepper */}
      <div className="max-w-[1400px] w-full mx-auto shrink-0">
        <OnboardingStepper currentStep={2} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 max-w-[1400px] w-full mx-auto px-8 pt-3 pb-3 flex flex-col">
        {/* Page title */}
        <div className="text-center mb-4 shrink-0">
          <h1 className="text-[#ec2626] font-bold text-xl mb-1">
            What&apos;s the Occassion?
          </h1>
          <p className="text-gray-500 text-xs leading-relaxed">
            Every celebration deserves a perfectly tailored gift. Pick your moment — we&apos;ll handle the rest.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-5 flex-wrap shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-200 ${
                activeTab === cat.id
                  ? "bg-[#ec2626] text-white border-[#ec2626] shadow-sm scale-[1.02]"
                  : "bg-white text-gray-500 border-gray-150 hover:border-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of occasion cards */}
        <div className="flex-1 min-h-0 overflow-y-auto px-1 pt-1.5 pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6">
            {filteredOccasions.map((occ) => {
              const isSelected =
                selected === occ.id ||
                (occ.id === "custom-occasion" &&
                  selected &&
                  !occasionsList.some((o) => o.id === selected));
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => {
                    if (occ.id === "custom-occasion") {
                      select(customOccasionText || "custom-occasion");
                    } else {
                      select(occ.id);
                    }
                  }}
                  className={`group bg-white rounded-2xl border-2 transition-all duration-200 p-4 flex flex-col items-center justify-between min-h-[140px] aspect-[4/3] ${
                    isSelected
                      ? "border-[#ec2626] bg-[#fff5f5] shadow-md scale-[1.02]"
                      : "border-gray-100 shadow-sm hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex-1 min-h-0 flex items-center justify-center w-full relative">
                    {occ.img ? (
                      typeof occ.img === "string" ? (
                        <img
                          src={occ.img}
                          alt={occ.label}
                          className="max-h-[100px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-xl"
                        />
                      ) : (
                        <Image
                          src={occ.img}
                          alt={occ.label}
                          className="max-h-[100px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      )
                    ) : (
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr ${occ.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      >
                        {occ.icon && <occ.icon size={24} className="stroke-[2]" />}
                      </div>
                    )}
                  </div>
                  <span className="text-[#ec2626] font-bold text-xs tracking-wider mt-3 shrink-0 uppercase text-center w-full truncate px-1">
                    {occ.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Occasion input block */}
          {isCustomActive && (
            <div className="mt-4 mb-6 p-5 bg-purple-50/30 border border-purple-100 rounded-2xl animate-fade-in flex flex-col gap-2.5 max-w-xl mx-auto shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Name Your Custom Occasion
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-purple-200 px-4 py-3 text-sm text-gray-800 placeholder-purple-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-200 transition-colors bg-white font-medium shadow-inner"
                placeholder="e.g. Employee Appreciation, Retreat Milestone, Wedding Gifting..."
                value={customOccasionText}
                onChange={(e) => {
                  setCustomOccasionText(e.target.value);
                  update({ occasions: [e.target.value || "custom-occasion"] });
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
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
              href="/onboarding/step1"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </Link>
            <Link
              href="/onboarding/step3"
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm text-white transition-all duration-200 ${
                canProceed
                  ? "bg-[#b91c1c] hover:bg-[#7c0404]"
                  : "bg-[#b91c1c]/60 pointer-events-none"
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
