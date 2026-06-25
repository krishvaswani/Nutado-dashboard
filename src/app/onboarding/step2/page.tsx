"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { subscribeOccasions, createOccasion } from "@/lib/firebase/firestore";
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [customOccasionText, setCustomOccasionText] = useState("");
  const [occasionsList, setOccasionsList] = useState<any[]>([]);
  
  // Festival popup states
  const [upcomingFestivals, setUpcomingFestivals] = useState<any[]>([]);
  const [showFestivalPopup, setShowFestivalPopup] = useState(false);
  const [isAdding, setIsAdding] = useState<Record<string, boolean>>({});
  const [activeFestivalIndex, setActiveFestivalIndex] = useState(0);

  const handleNextFestival = () => {
    if (activeFestivalIndex < upcomingFestivals.length - 1) {
      setActiveFestivalIndex(prev => prev + 1);
    } else {
      setShowFestivalPopup(false);
    }
  };

  const handleOrderNow = async (festival: any) => {
    setIsAdding(prev => ({ ...prev, [festival.id]: true }));
    try {
      const occId = festival.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const bannerMessage = `${festival.name} is coming up on ${new Date(festival.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}! Order your customized box today to receive it in time.`;
      
      await createOccasion({
        label: festival.name,
        category: "festivals",
        color: "amber",
        icon: "Sparkles",
        festivalDate: festival.date,
        bannerEnabled: true,
        bannerMessage: bannerMessage,
        preOrderDays: 7
      });
      
      update({ occasions: [occId] });
      router.push("/onboarding/step3");
    } catch (err) {
      console.error("Failed to select occasion and redirect", err);
    } finally {
      setIsAdding(prev => ({ ...prev, [festival.id]: false }));
    }
  };

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
          bannerImg: item.bannerImg || null,
          bannerEnabled: item.bannerEnabled || false,
          bannerMessage: item.bannerMessage || null,
          festivalDate: item.festivalDate || null,
          preOrderDays: item.preOrderDays || 7,
        };
      });
      setOccasionsList(mapped);
    });
    return () => unsub();
  }, []);

  // Compute upcoming festivals list on the client side
  useEffect(() => {
    if (occasionsList.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter active manual festivals from real-time occasionsList
    const manualFestList = occasionsList
      .filter((occ: any) => occ.bannerEnabled && occ.festivalDate)
      .map((occ: any) => {
        const festDate = new Date(occ.festivalDate);
        return {
          id: occ.id,
          name: occ.label,
          date: occ.festivalDate,
          bannerImg: occ.bannerImg || null,
          bannerMessage: occ.bannerMessage || null,
          category: occ.category,
          source: "manual",
          sortDate: festDate,
        };
      })
      .filter((occ: any) => {
        const festDate = occ.sortDate;
        return festDate >= today;
      });

    // Generate defaults
    const defaultFestList = [
      { name: "New Year's Day", month: 0, day: 1 },
      { name: "Republic Day", month: 0, day: 26 },
      { name: "Holi", month: 2, day: 14 },
      { name: "Eid al-Fitr", month: 2, day: 31 },
      { name: "Independence Day", month: 7, day: 15 },
      { name: "Gandhi Jayanti", month: 9, day: 2 },
      { name: "Diwali", month: 10, day: 4 },
      { name: "Christmas", month: 11, day: 25 },
    ];

    const projectedDefaults = defaultFestList
      .map((fest) => {
        const year = today.getFullYear();
        let occurrence = new Date(year, fest.month, fest.day);
        if (occurrence < today) {
          occurrence = new Date(year + 1, fest.month, fest.day);
        }
        return {
          id: `default-${fest.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          name: fest.name,
          date: occurrence.toISOString().split("T")[0],
          bannerImg: null,
          source: "default",
          sortDate: occurrence,
        };
      })
      .filter((fest) => fest.sortDate >= today);

    // Merge: manual overrides default if names match
    const combined: any[] = [...manualFestList];
    projectedDefaults.forEach((def) => {
      const exists = manualFestList.some(
        (m) => m.name.toLowerCase() === def.name.toLowerCase()
      );
      if (!exists) {
        combined.push(def);
      }
    });

    // Sort by date ascending
    combined.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());

    const topThree = combined.slice(0, 3);

    if (topThree.length > 0) {
      setUpcomingFestivals(topThree);
      setShowFestivalPopup(true);
    } else {
      setShowFestivalPopup(false);
    }
  }, [occasionsList]);


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
      </div>      {/* Festival Reminder Popup */}
      {showFestivalPopup && upcomingFestivals[activeFestivalIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            {/* Header with gradient and progress indicator */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white shrink-0 relative">
              <button 
                onClick={handleNextFestival}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                title="Skip to next festival"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={24} className="text-white" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-50">Upcoming Festival Alert</span>
              </div>
              <h2 className="text-2xl font-black tracking-wide leading-tight">
                {upcomingFestivals[activeFestivalIndex].name}
              </h2>
            </div>
            
            {/* Content area */}
            <div className="p-6 bg-gray-50/50 flex-1 flex flex-col items-center text-center">
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2 mb-4">
                <span className="text-xs font-bold text-amber-700">
                  {new Date(upcomingFestivals[activeFestivalIndex].date).toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              
              {upcomingFestivals[activeFestivalIndex].bannerImg && (
                <div className="w-full max-h-[140px] overflow-hidden rounded-xl border border-gray-200 bg-white p-1 mb-4 flex items-center justify-center shadow-inner">
                  <img 
                    src={upcomingFestivals[activeFestivalIndex].bannerImg} 
                    alt={`${upcomingFestivals[activeFestivalIndex].name} Banner`} 
                    className="max-h-[130px] w-auto object-contain rounded-lg"
                  />
                </div>
              )}
              
              <p className="text-sm text-gray-600 leading-relaxed max-w-sm mb-2">
                {upcomingFestivals[activeFestivalIndex].bannerMessage || (
                  <>
                    Would you like to enable a reminder banner on your storefront for <strong>{upcomingFestivals[activeFestivalIndex].name}</strong> so customers can customize and place orders in time?
                  </>
                )}
              </p>
            </div>
            
            {/* Footer buttons */}
            <div className="p-4 border-t border-gray-150 bg-white shrink-0">
              <button
                onClick={() => handleOrderNow(upcomingFestivals[activeFestivalIndex])}
                disabled={isAdding[upcomingFestivals[activeFestivalIndex].id]}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wide text-white hover:opacity-90 transition-all text-center cursor-pointer shadow-sm"
                style={{ backgroundColor: state.primaryColor || "#ec2626" }}
              >
                {isAdding[upcomingFestivals[activeFestivalIndex].id] ? "Processing..." : "Order Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
