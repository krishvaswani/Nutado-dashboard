"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRight, X, ChevronDown, ChevronLeft, ChevronRight, Lock, ShoppingBag, Sparkles } from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { useOnboarding } from "@/context/OnboardingContext";

import heroBanner from "@/Assets/Slide3/herobanner.jpg";
import box1 from "@/Assets/Slide3/box1.png";
import box2 from "@/Assets/Slide3/box 2.png";
import box3 from "@/Assets/Slide3/box3.png";
import box4 from "@/Assets/Slide3/box4.png";
import box5 from "@/Assets/Slide3/box5.png";
import box6 from "@/Assets/Slide3/box6.png";
import box7 from "@/Assets/Slide3/box7.png";
import box8 from "@/Assets/Slide3/box8.png";
import makhanaImg from "@/Assets/Slide3/makhana.png";

const SIGNATURE_BOXES = [
  { id: 1, label: "Nutado Box 1", img: box1 },
  { id: 2, label: "Nutado Box 2", img: box2 },
  { id: 3, label: "Nutado Box 3", img: box3 },
  { id: 4, label: "Nutado Box 4", img: box4 },
  { id: 5, label: "Nutado Box 5", img: box5 },
  { id: 6, label: "Nutado Box 6", img: box6 },
  { id: 7, label: "Nutado Box 7", img: box7 },
  { id: 8, label: "Nutado Box 8", img: box8 },
];

const CATEGORIES: {
  id: string;
  label: string;
  img?: typeof makhanaImg;
}[] = [
  { id: "all", label: "All" },
  { id: "makhana", label: "Makhana", img: makhanaImg },
  { id: "nuts", label: "Nuts" },
  { id: "trail-mix", label: "Trial Mix" },
  { id: "dried-fruits", label: "Dried Fruits" },
  { id: "specialty", label: "Specialty" },
  { id: "healthy", label: "Healthy" },
  { id: "gifting", label: "Gifting Add-ons" },
];

const FEATURED_PRODUCTS = Array.from({ length: 6 }, (_, i) => ({
  id: 100 + i,
  name: "ROASTED & SALTED ALMONDS",
  desc: "Classic crowd-pleasing premium almonds",
}));

const ALL_PRODUCTS = Array.from({ length: 9 }, (_, i) => ({
  id: 200 + i,
  name: "ROASTED & SALTED ALMONDS",
  desc: "Classic crowd-pleasing premium almonds",
}));

function PouchSvg({ color, label }: { color: "blue" | "cream"; label: string }) {
  const isBlue = color === "blue";
  return (
    <div
      className={`relative w-[44%] aspect-[3/4] rounded-md shadow-md overflow-hidden ${
        isBlue ? "bg-[#1f6cd6]" : "bg-[#f0e6b5]"
      }`}
    >
      {/* top seal */}
      <div
        className={`absolute top-0 left-0 right-0 h-[10%] ${
          isBlue ? "bg-[#0d3d8a]" : "bg-[#8a7d3a]"
        }`}
      />
      {/* brand badge */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-[18%] w-[70%] aspect-[2.2/1] rounded-full flex flex-col items-center justify-center ${
          isBlue ? "bg-[#13366f]" : "bg-[#3a2e16]"
        }`}
      >
        <span className="text-white font-display font-bold text-[10px] leading-none italic">
          Farmley
        </span>
        <span className="text-white text-[5px] font-bold tracking-wider mt-0.5 text-center px-1 leading-tight">
          CLASSIC SALTED
          <br />
          {label}
        </span>
      </div>
      {/* food bowl illustration */}
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[70%] h-[28%] rounded-full bg-white/90 flex items-center justify-center">
        <div
          className={`w-[80%] h-[70%] rounded-full ${
            label === "ALMONDS" ? "bg-amber-700/70" : "bg-yellow-600/70"
          }`}
        />
      </div>
      {/* protein label */}
      <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 text-[5px] font-bold text-white/90 text-center leading-tight">
        CHOLESTEROL FREE
        <br />
        22% PROTEIN
      </div>
    </div>
  );
}

function ProductCard({
  isSelected,
  onAdd,
}: {
  isSelected: boolean;
  onAdd: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        isSelected ? "border-[#0a6e3a]" : "border-gray-100"
      } shadow-sm`}
    >
      {/* Image area */}
      <div className="bg-gray-50 px-4 pt-4 pb-3 flex items-end justify-center gap-1 aspect-[5/4]">
        <PouchSvg color="blue" label="ALMONDS" />
        <PouchSvg color="cream" label="CASHEWS" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-bold text-[15px] text-gray-900 leading-tight tracking-tight">
            ROASTED &amp; SALTED
            <br />
            ALMONDS
          </h4>
          <button
            type="button"
            onClick={onAdd}
            className="shrink-0 inline-flex items-center gap-1.5 border-2 border-[#0a6e3a] text-[#0a6e3a] text-sm font-semibold rounded-full px-4 py-1.5 hover:bg-[#f0f9f4] transition-colors"
          >
            <ShoppingBag size={16} strokeWidth={2} />
            Add
          </button>
        </div>
        <p className="text-[13px] text-gray-500 leading-snug mb-3">
          Classic crowd-pleasing premium almonds
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-orange-400 rounded-full px-2.5 py-1">
            <Sparkles size={10} strokeWidth={2.5} /> Pan-India Favourite
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-sky-400 rounded-full px-2.5 py-1">
            <Sparkles size={10} strokeWidth={2.5} /> #1 in Every Region
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-emerald-400 rounded-full px-2.5 py-1">
            <Sparkles size={10} strokeWidth={2.5} /> Gifting Staple
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingStep3() {
  const { state, update } = useOnboarding();
  const [boxType, setBoxType] = useState<"signature" | "custom">(
    state.boxType ?? "signature"
  );
  const [selectedBox, setSelectedBox] = useState<number | undefined>(
    state.signatureBoxId
  );
  const [previewBoxId, setPreviewBoxId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [pickedProducts, setPickedProducts] = useState<Set<number>>(new Set());
  const [savedAt] = useState("8 seconds ago");

  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleFeaturedScroll = () => {
    const el = featuredScrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  const scrollFeatured = (dir: 1 | -1) => {
    const el = featuredScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const togglePick = (id: number) =>
    setPickedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const unlockedCount = Math.min(8, Math.floor(pickedProducts.size / 1) > 0 ? 1 : 1);

  const previewBox = SIGNATURE_BOXES.find((b) => b.id === previewBoxId) ?? null;

  const handleNext = () => {
    update({ boxType, signatureBoxId: selectedBox });
  };

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col overflow-hidden">
      {/* Stepper */}
      <div className="max-w-[1400px] w-full mx-auto shrink-0">
        <OnboardingStepper currentStep={3} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[1400px] w-full mx-auto px-8 pt-3 pb-6">
          {/* Hero banner */}
          <div className="rounded-2xl overflow-hidden mb-6">
            <Image
              src={heroBanner}
              alt="Happy Diwali — Festival of Lights"
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Box-type toggle */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setBoxType("signature")}
              className={`rounded-2xl px-6 py-5 text-center transition-all duration-200 border-2 ${
                boxType === "signature"
                  ? "bg-[#0a4f2a] border-[#0a4f2a] text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-900 hover:border-gray-300"
              }`}
            >
              <div className="font-bold text-base mb-1">Nutado Signature</div>
              <p
                className={`text-xs leading-relaxed ${
                  boxType === "signature" ? "text-white/85" : "text-gray-500"
                }`}
              >
                Let our experts do the magic. Meticulously curated, perfectly balanced collections.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setBoxType("custom")}
              className={`rounded-2xl px-6 py-5 text-center transition-all duration-200 border-2 ${
                boxType === "custom"
                  ? "bg-[#0a4f2a] border-[#0a4f2a] text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-900 hover:border-gray-300"
              }`}
            >
              <div className="font-bold text-base mb-1">Build Your Own</div>
              <p
                className={`text-xs leading-relaxed ${
                  boxType === "custom" ? "text-white/85" : "text-gray-500"
                }`}
              >
                You&apos;ve already chosen your products. Pick your box size and make it yours.
              </p>
            </button>
          </div>

          {/* Signature collections / Build your own */}
          {boxType === "signature" ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-[#0a6e3a] font-bold text-xl mb-2">
                  Choose Your Box Type
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-3xl mx-auto">
                  Go signature with a Nutado curated collection, or architect something entirely your own. Then add a beautiful gift card to complete the experience.
                </p>
              </div>
              <h3 className="text-[#0a6e3a] font-bold text-sm uppercase tracking-wide mb-5">
                Our Signature Collections
              </h3>
              <div className="grid grid-cols-4 gap-x-6 gap-y-8">
                {SIGNATURE_BOXES.map((box) => {
                  const isSelected = selectedBox === box.id;
                  return (
                    <button
                      key={box.id}
                      type="button"
                      onClick={() => {
                        setSelectedBox(box.id);
                        setPreviewBoxId(box.id);
                      }}
                      className={`group rounded-xl border-2 p-4 transition-all duration-200 flex flex-col items-center ${
                        isSelected
                          ? "border-[#0a6e3a] bg-[#f0f9f4]"
                          : "border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="w-full aspect-[5/4] flex items-center justify-center mb-4 overflow-hidden">
                        <Image
                          src={box.img}
                          alt={box.label}
                          className="w-full h-full object-contain scale-125"
                        />
                      </div>
                      <span className="font-semibold text-lg text-gray-900">
                        {box.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {/* BYO heading */}
              <div className="text-center mb-5">
                <h2 className="text-[#0a6e3a] font-bold text-xl mb-2">
                  Pick Your Products
                </h2>
                <p className="text-gray-500 text-sm">
                  Great choice of box! Now pick exactly 8 items to fill your box.
                </p>
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const hasImg = !!cat.img;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`relative rounded-full text-sm font-semibold border transition-colors ${
                        hasImg ? "pl-12 pr-6 py-2.5" : "px-6 py-2.5"
                      } ${
                        isActive
                          ? "bg-[#0a4f2a] border-[#0a4f2a] text-white"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {hasImg && cat.img && (
                        <Image
                          src={cat.img}
                          alt=""
                          aria-hidden
                          className="absolute -left-3 -top-3 h-[60px] w-auto object-contain pointer-events-none drop-shadow-sm"
                        />
                      )}
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Two-column: box stack + products */}
              <div className="flex gap-5">
                {/* Left: 8 box slots */}
                <div className="w-[170px] shrink-0 bg-white rounded-2xl p-3 shadow-sm flex flex-col gap-3">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const isUnlocked = i < unlockedCount;
                    return (
                      <div
                        key={i}
                        className={`relative rounded-xl overflow-hidden aspect-[3/4] flex flex-col items-center justify-center text-center ${
                          isUnlocked ? "bg-[#0a4f2a]" : "bg-gray-400"
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            <div className="flex-1 w-full flex items-center justify-center px-2 pt-3">
                              <Image
                                src={box2}
                                alt="Unlocked box"
                                className="max-h-full w-auto object-contain"
                              />
                            </div>
                            <span className="text-white text-sm font-semibold pb-3">
                              Unlocked
                            </span>
                          </>
                        ) : (
                          <>
                            <Image
                              src={box1}
                              alt=""
                              aria-hidden
                              className="absolute inset-0 w-full h-full object-cover opacity-50"
                            />
                            <div className="absolute inset-0 bg-gray-500/40" />
                            <Lock
                              className="relative text-white mb-2"
                              size={28}
                              strokeWidth={2.5}
                            />
                            <span className="relative text-white text-[11px] font-medium leading-tight px-3">
                              Add more products to unlock this box
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right: featured + all products */}
                <div className="flex-1 min-w-0">
                  {/* Featured banner */}
                  <div className="mb-4 flex">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-yellow-300 text-white font-bold text-sm tracking-wide">
                      <Sparkles size={16} />
                      FEATURED FORNAVRATRI
                    </div>
                  </div>

                  {/* Featured slider */}
                  <div className="relative">
                    <div
                      ref={featuredScrollRef}
                      onScroll={handleFeaturedScroll}
                      className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
                    >
                      {FEATURED_PRODUCTS.map((p, i) => (
                        <div
                          key={p.id}
                          className="snap-start shrink-0 w-[calc((100%-2rem)/3)]"
                        >
                          <ProductCard
                            isSelected={i === 0}
                            onAdd={() => togglePick(p.id)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Slider bar with arrows */}
                    <div className="flex items-center gap-3 mt-3 px-1">
                      <button
                        type="button"
                        onClick={() => scrollFeatured(-1)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Previous"
                      >
                        <ChevronLeft size={22} strokeWidth={1.5} />
                      </button>
                      <div className="flex-1 h-px bg-gray-300 relative">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 left-0 h-[3px] bg-gray-800 rounded-full transition-all"
                          style={{
                            width: `${Math.max(15, scrollProgress * 100)}%`,
                            transform: `translate(${scrollProgress * (100 - Math.max(15, scrollProgress * 100))}%, -50%)`,
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollFeatured(1)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Next"
                      >
                        <ChevronRight size={22} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {/* All products banner */}
                  <div className="mt-6 mb-4 flex">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-400 text-white font-bold text-sm tracking-wide">
                      <Sparkles size={16} />
                      ALL PRODUCTS
                    </div>
                  </div>

                  {/* All products grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {ALL_PRODUCTS.map((p, i) => (
                      <ProductCard
                        key={p.id}
                        isSelected={i === 4}
                        onAdd={() => togglePick(p.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <span className="text-sm text-gray-400">Draft link saved {savedAt}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding/step2"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </Link>
            <Link
              href="/onboarding/step4"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm text-white bg-[#1b5e38] hover:bg-[#134529] transition-colors"
            >
              Next
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Box detail modal */}
      {previewBox && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setPreviewBoxId(null)}
        >
          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl relative overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewBoxId(null)}
              aria-label="Close"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto px-10 pt-10 pb-8">
              <div className="flex items-center justify-center mb-8">
                <Image
                  src={previewBox.img}
                  alt={previewBox.label}
                  className="max-h-[320px] w-auto object-contain"
                />
              </div>

              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <div className="flex gap-0.5">
                        <div className="w-7 h-9 rounded-sm bg-blue-500" />
                        <div className="w-7 h-9 rounded-sm bg-yellow-300" />
                      </div>
                    </div>
                    <div className="flex-1 font-bold text-sm tracking-wide text-gray-900">
                      ROASTED &amp; SALTED ALMONDS
                    </div>
                    <div className="w-72">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between border-2 border-[#0a6e3a] rounded-lg px-4 py-3 text-sm text-gray-500 hover:bg-[#f0f9f4] transition-colors"
                      >
                        <span>Choose your varient</span>
                        <ChevronDown size={18} className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-10 pb-8 pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setPreviewBoxId(null)}
                className="px-16 py-3 rounded-lg bg-[#0a4f1f] hover:bg-[#073a16] text-white font-semibold text-base transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
