"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Lock,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import OnboardingDraftStatus from "@/components/onboarding/OnboardingDraftStatus";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import {
  CUSTOM_BOX_CRITERIA_KEY,
  DEFAULT_CUSTOM_BOX_CRITERIA,
} from "@/lib/constants";
import { subscribeSignatureBoxes, subscribeProducts } from "@/lib/firebase/firestore";
import type { SignatureBoxRecord } from "@/types";
const PredefinedBoxCustomizerModal = dynamic(
  () => import("@/components/onboarding/PredefinedBoxCustomizerModal"),
  { ssr: false }
);
const CustomBoxDetailsModal = dynamic(
  () => import("@/components/onboarding/CustomBoxDetailsModal"),
  { ssr: false }
);
const ProductDetailsModal = dynamic(
  () => import("@/components/onboarding/ProductDetailsModal"),
  { ssr: false }
);
import ProductIcon from "@/components/ui/ProductIcon";
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
  { id: 1, label: "Consuetudo Box 1", img: box1 },
  { id: 2, label: "Consuetudo Box 2", img: box2 },
  { id: 3, label: "Consuetudo Box 3", img: box3 },
  { id: 4, label: "Consuetudo Box 4", img: box4 },
  { id: 5, label: "Consuetudo Box 5", img: box5 },
  { id: 6, label: "Consuetudo Box 6", img: box6 },
  { id: 7, label: "Consuetudo Box 7", img: box7 },
  { id: 8, label: "Consuetudo Box 8", img: box8 },
];

const PRESET_IMAGE_MAP: Record<string, any> = {
  preset_1: box1,
  preset_2: box2,
  preset_3: box3,
  preset_4: box4,
  preset_5: box5,
  preset_6: box6,
  preset_7: box7,
  preset_8: box8,
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "makhana", label: "Makhana", img: makhanaImg },
  { id: "nuts", label: "Nuts" },
  { id: "trail-mix", label: "Trial Mix" },
  { id: "dried-fruits", label: "Dried Fruits" },
  { id: "specialty", label: "Specialty" },
  { id: "healthy", label: "Healthy" },
  { id: "gifting", label: "Gifting Add-ons" },
];

function PouchArt({ color, label }: { color: "blue" | "cream"; label: string }) {
  const isBlue = color === "blue";

  return (
    <div
      className={`relative w-[44%] aspect-[4/4] rounded-md shadow-md overflow-hidden ${
        isBlue ? "bg-[#1f6cd6]" : "bg-[#f0e6b5]"
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-[10%] ${
          isBlue ? "bg-[#0d3d8a]" : "bg-[#8a7d3a]"
        }`}
      />
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
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[70%] h-[28%] rounded-full bg-white/90 flex items-center justify-center">
        <div className="w-[80%] h-[70%] rounded-full bg-yellow-600/70" />
      </div>
    </div>
  );
}

function ProductCard({
  product,
  isSelected,
  isDisabled,
  onAdd,
  onViewDetails,
}: {
  product: any;
  isSelected: boolean;
  isDisabled?: boolean;
  onAdd: () => void;
  onViewDetails?: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden flex flex-col justify-between h-full ${
        isSelected
          ? "border-[#ec2626] shadow-sm bg-brand-50/5"
          : isDisabled
            ? "border-gray-150 opacity-40 filter grayscale-[40%] select-none pointer-events-none"
            : "border-gray-100 hover:border-nutado-green/30"
      }`}
    >
      <div onClick={onViewDetails} className="cursor-pointer flex-1 flex flex-col group/prod">
        <div className="bg-gray-50 flex items-center justify-center aspect-[5/4] overflow-hidden relative border-b border-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/prod:scale-105"
            />
          ) : (
            <ProductIcon category={product.category} name={product.name} size={32} className="w-16 h-16 transition-transform duration-300 group-hover/prod:scale-105" />
          )}
          {product.badge && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-[14px] text-gray-900 leading-tight tracking-tight uppercase truncate group-hover/prod:text-nutado-green transition-colors" title={product.name}>
              {product.name}
            </h4>
            <p className="text-[12px] text-gray-500 leading-snug mt-0.5">
              {product.brand} • {product.weight}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-white bg-emerald-600 rounded-full px-2 py-0.5">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-gray-400 line-through px-1">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          type="button"
          disabled={isDisabled}
          onClick={onAdd}
          className={`w-full inline-flex items-center justify-center gap-1.5 border-2 border-[#ec2626] text-sm font-semibold rounded-full py-1.5 transition-all ${
            isSelected
              ? "bg-[#ec2626] text-white hover:bg-[#7c0404]"
              : isDisabled
                ? "text-gray-400 border-gray-300 bg-gray-50 cursor-not-allowed"
                : "text-[#ec2626] hover:bg-[#fff5f5]"
          }`}
        >
          <ShoppingBag size={15} strokeWidth={2} />
          {isSelected ? "Added to Box" : "Add to Box"}
        </button>
      </div>
    </div>
  );
}

function SignatureBoxButton({ box, isSelected, onClick }: { box: any; isSelected: boolean; onClick: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const imagesList = box.imageUrls && box.imageUrls.length > 0
    ? box.imageUrls
    : [typeof box.img === "string" ? box.img : `preset_${box.id}`];

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const currentImg = imagesList[activeIdx];
  const isPresetString = typeof currentImg === "string" && currentImg.startsWith("preset_");
  
  const PRESET_IMAGE_MAP: Record<string, any> = {
    preset_1: box1,
    preset_2: box2,
    preset_3: box3,
    preset_4: box4,
    preset_5: box5,
    preset_6: box6,
    preset_7: box7,
    preset_8: box8,
  };

  const resolvedBoxImg = isPresetString
    ? PRESET_IMAGE_MAP[currentImg] || box1
    : typeof currentImg === "string"
    ? currentImg
    : box.img;

  return (
    <div
      onClick={onClick}
      className={`group/box relative rounded-xl border-2 p-4 transition-all duration-200 flex flex-col items-center bg-white cursor-pointer ${
        isSelected
          ? "border-[#ec2626] bg-[#fff5f5]"
          : "border-transparent hover:border-gray-200"
      }`}
    >
      <div className="w-full aspect-[5/4] flex items-center justify-center mb-4 overflow-hidden relative select-none">
        {typeof resolvedBoxImg === "string" ? (
          <img
            src={resolvedBoxImg}
            alt={box.label}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Image
            src={resolvedBoxImg}
            alt={box.label}
            className="w-full h-full object-contain scale-125"
          />
        )}

        {/* Carousel Chevrons (Visible on Hover if multi-image) */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-gray-700 p-1 rounded-full shadow-md hover:scale-105 transition-all opacity-0 group-hover/box:opacity-100 z-10 flex items-center justify-center animate-fade-in"
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-gray-700 p-1 rounded-full shadow-md hover:scale-105 transition-all opacity-0 group-hover/box:opacity-100 z-10 flex items-center justify-center animate-fade-in"
            >
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>

            {/* Dots indicators */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {imagesList.map((_: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeIdx ? "bg-emerald-600 w-3" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {box.productIds && box.productIds.length > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.75 bg-[#ec2626] text-white text-[10px] font-bold rounded shadow-sm z-10">
            {box.productIds.length} items
          </span>
        )}
      </div>
      <span className="font-semibold text-base text-gray-900 text-center truncate max-w-full">
        {box.label}
      </span>
    </div>
  );
}

function LockedCustomBoxCard({
  box,
  isActive,
  PRESET_IMAGE_MAP,
  onClick
}: {
  box: SignatureBoxRecord;
  isActive: boolean;
  PRESET_IMAGE_MAP: Record<string, any>;
  onClick?: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  const imagesList = box.imageUrls && box.imageUrls.length > 0
    ? box.imageUrls
    : [box.imageUrl || "preset_1"];

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const currentImg = imagesList[activeIdx];
  const isPreset = currentImg ? currentImg.startsWith("preset_") : false;
  const resolveImg = isPreset ? PRESET_IMAGE_MAP[currentImg] || box1 : currentImg || box1;

  const boxVol = (Number(box.length) || 0) * (Number(box.width) || 0) * (Number(box.height) || 0);
  const boxWeight = Number(box.weight) || 0;
  const boxMaxPrice = Number(box.maxPrice) || 0;

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden p-3 border-2 transition-all duration-300 flex flex-col items-center justify-between text-center group/allocator cursor-pointer ${
        isActive
          ? "bg-[#7c0404] border-[#7c0404] text-white shadow-md ring-2 ring-[#7c0404]/20 scale-105"
          : "bg-white border-gray-150 text-gray-600 opacity-70"
      }`}
    >
      {/* Image Container */}
      <div className="h-16 w-full flex items-center justify-center relative mb-2 select-none">
        {isPreset || !currentImg ? (
          <Image
            src={resolveImg}
            alt={box.label}
            className="max-h-full w-auto object-contain"
          />
        ) : (
          <img
            src={currentImg}
            alt={box.label}
            className="max-h-full w-auto object-contain rounded"
          />
        )}

        {/* Locked Overlay */}
        {!isActive && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded group-hover/allocator:opacity-0 transition-opacity">
            <Lock className="text-gray-400" size={16} />
          </div>
        )}

        {/* Multi-image Chevrons */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-0.5 top-1/2 -translate-y-1/2 bg-white/95 text-gray-800 p-0.5 rounded-full shadow hover:scale-105 opacity-0 group-hover/allocator:opacity-100 transition-opacity z-20 flex items-center justify-center"
            >
              <ChevronLeft size={10} strokeWidth={3} />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-0.5 top-1/2 -translate-y-1/2 bg-white/95 text-gray-800 p-0.5 rounded-full shadow hover:scale-105 opacity-0 group-hover/allocator:opacity-100 transition-opacity z-20 flex items-center justify-center"
            >
              <ChevronRight size={10} strokeWidth={3} />
            </button>
          </>
        )}
      </div>

      {/* Box Title */}
      <span className={`text-xs font-bold ${isActive ? "text-white" : "text-gray-800"}`}>
        {box.label}
      </span>

      {/* Box Specs */}
      <div className={`mt-2 w-full text-[9px] space-y-0.5 border-t pt-1.5 ${isActive ? "border-white/10 text-white/80" : "border-gray-100 text-gray-400"}`}>
        <p className="flex justify-between px-1">
          <span>Vol:</span>
          <span className="font-semibold">{boxVol} cm³</span>
        </p>
        <p className="flex justify-between px-1">
          <span>Weight Limit:</span>
          <span className="font-semibold">{boxWeight}g</span>
        </p>
        <p className="flex justify-between px-1">
          <span>Max Value:</span>
          <span className="font-semibold">₹{boxMaxPrice}</span>
        </p>
      </div>

      {/* Active Badge */}
      {isActive && (
        <span className="absolute top-1.5 right-1.5 bg-[#e05c1a] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
          Active
        </span>
      )}
    </div>
  );
}

export default function OnboardingStep3() {
  const { state, update } = useOnboarding();
  const { profile } = useAuth();
  const [criteria] = useLocalStorage(
    CUSTOM_BOX_CRITERIA_KEY,
    DEFAULT_CUSTOM_BOX_CRITERIA,
  );
  const [activeCategory, setActiveCategory] = useState("all");
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dbBoxes, setDbBoxes] = useState<SignatureBoxRecord[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [customizingBox, setCustomizingBox] = useState<any | null>(null);
  const [selectedDetailsBox, setSelectedDetailsBox] = useState<SignatureBoxRecord | null>(null);
  const [selectedDetailsProduct, setSelectedDetailsProduct] = useState<any | null>(null);

  useEffect(() => {
    const unsubBoxes = subscribeSignatureBoxes((data) => {
      setDbBoxes(data);
    });
    const unsubProds = subscribeProducts((data) => {
      setProductsList(data);
    });
    return () => {
      unsubBoxes();
      unsubProds();
    };
  }, []);

  const resolvedSignatureBoxes = useMemo(() => {
    return [
      ...dbBoxes.filter((b) => b.boxType !== "custom").map((b) => ({
        id: b.id,
        label: b.label,
        img: b.imageUrl ? (b.imageUrl.startsWith("preset_") ? PRESET_IMAGE_MAP[b.imageUrl] || box1 : b.imageUrl) : box1,
        imageUrls: b.imageUrls && b.imageUrls.length > 0 ? b.imageUrls : [b.imageUrl || "preset_1"],
        isPreset: false,
        productIds: b.productIds,
        optionalProductIds: b.optionalProductIds || [],
        length: b.length || 0,
        width: b.width || 0,
        height: b.height || 0,
        weight: b.weight || 0,
        maxPrice: b.maxPrice || 0,
      })),
      ...SIGNATURE_BOXES.map((b) => ({
        id: b.id,
        label: b.label,
        img: b.img,
        imageUrls: [`preset_${b.id}`],
        isPreset: true,
        productIds: [] as number[],
        optionalProductIds: [] as any[],
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        maxPrice: 0,
      })),
    ];
  }, [dbBoxes]);

  const homeHref = profile?.role === "client" ? "/user-dashboard" : "/dashboard";
  const isCustom = state.boxType === "custom";
  const selectedCount = state.products.length;

  // 1. Gather all custom boxes
  const clientCustomBoxes = useMemo(() => dbBoxes.filter(b => b.boxType === "custom"), [dbBoxes]);
  const defaultCustomBoxes = useMemo<SignatureBoxRecord[]>(() => [
    { id: "c1", label: "Consuetudo Lite Box", imageUrl: "preset_1", productIds: [], createdAt: "", boxType: "custom", length: 15, width: 15, height: 10, weight: 300, maxPrice: 1000 },
    { id: "c2", label: "Consuetudo Standard Box", imageUrl: "preset_2", productIds: [], createdAt: "", boxType: "custom", length: 25, width: 25, height: 15, weight: 800, maxPrice: 2500 },
    { id: "c3", label: "Consuetudo Premium Box", imageUrl: "preset_3", productIds: [], createdAt: "", boxType: "custom", length: 35, width: 35, height: 20, weight: 1500, maxPrice: 5000 },
  ], []);
  const customBoxesToUse = clientCustomBoxes.length > 0 ? clientCustomBoxes : defaultCustomBoxes;

  // 2. Compute current totals of selected products
  const selectedProductsDetails = useMemo(() => {
    return state.products.map(pid => productsList.find(p => String(p.id) === String(pid))).filter(Boolean);
  }, [state.products, productsList]);
  
  const totalVolume = useMemo(() => {
    return selectedProductsDetails.reduce((sum, p) => {
      const vol = (Number(p.length) || 10) * (Number(p.width) || 10) * (Number(p.height) || 10);
      return sum + vol;
    }, 0);
  }, [selectedProductsDetails]);

  const totalWeight = useMemo(() => {
    return selectedProductsDetails.reduce((sum, p) => {
      const wt = parseFloat(p.weight) || 100;
      return sum + wt;
    }, 0);
  }, [selectedProductsDetails]);

  const totalPrice = useMemo(() => {
    return selectedProductsDetails.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [selectedProductsDetails]);

  // 3. Sort custom boxes by volume ascending
  const sortedCustomBoxes = useMemo(() => {
    return [...customBoxesToUse].sort((a, b) => {
      const volA = (Number(a.length) || 0) * (Number(a.width) || 0) * (Number(a.height) || 0);
      const volB = (Number(b.length) || 0) * (Number(b.width) || 0) * (Number(b.height) || 0);
      return volA - volB;
    });
  }, [customBoxesToUse]);

  // 4. Determine the active box based on Volume, Weight, and Price limits (incorporating +- 50 tolerance for first & last box)
  const activeCustomBox = useMemo(() => {
    return sortedCustomBoxes.find((box, idx) => {
      const boxVol = (Number(box.length) || 0) * (Number(box.width) || 0) * (Number(box.height) || 0);
      const boxWeight = Number(box.weight) || 0;
      
      const isFirst = idx === 0;
      const isLast = idx === sortedCustomBoxes.length - 1;
      const effectiveMaxPrice = (isFirst || isLast) ? (Number(box.maxPrice) || 0) + 50 : (Number(box.maxPrice) || 0);

      return totalVolume <= boxVol && totalWeight <= boxWeight && totalPrice <= effectiveMaxPrice;
    }) || sortedCustomBoxes[sortedCustomBoxes.length - 1]; // fallback to largest if none matches
  }, [sortedCustomBoxes, totalVolume, totalWeight, totalPrice]);

  // 5. Sync active signatureBoxId to context state
  useEffect(() => {
    if (isCustom && activeCustomBox) {
      if (state.signatureBoxId !== activeCustomBox.id) {
        update({ signatureBoxId: activeCustomBox.id });
      }
    }
  }, [isCustom, activeCustomBox, state.signatureBoxId, update]);

  const featuredProducts = productsList.slice(0, 6);
  const allProducts = activeCategory === "all"
    ? productsList
    : productsList.filter((p) => p.category && p.category.toLowerCase() === activeCategory.toLowerCase());

  const canProceed = isCustom
    ? (selectedCount > 0 && !!activeCustomBox)
    : Boolean(state.signatureBoxId);

  const checkIsProductDisabled = useCallback((product: any) => {
    // If already selected, it is NOT disabled! (User can always deselect/remove it)
    if (state.products.includes(product.id)) {
      return false;
    }

    // Calculate candidate totals including this product
    const prodVol = (Number(product.length) || 10) * (Number(product.width) || 10) * (Number(product.height) || 10);
    const prodWeight = parseFloat(product.weight) || 100;
    const prodPrice = product.price || 0;

    const candidateVolume = totalVolume + prodVol;
    const candidateWeight = totalWeight + prodWeight;
    const candidatePrice = totalPrice + prodPrice;

    // Check if any box fits these candidate totals (respecting tolerance rules)
    const matchingBox = sortedCustomBoxes.find((box, idx) => {
      const boxVol = (Number(box.length) || 0) * (Number(box.width) || 0) * (Number(box.height) || 0);
      const boxWeight = Number(box.weight) || 0;
      
      const isFirst = idx === 0;
      const isLast = idx === sortedCustomBoxes.length - 1;
      const effectiveMaxPrice = (isFirst || isLast) ? (Number(box.maxPrice) || 0) + 50 : (Number(box.maxPrice) || 0);

      return candidateVolume <= boxVol && candidateWeight <= boxWeight && candidatePrice <= effectiveMaxPrice;
    });

    // If no box fits, it means adding this product would exceed all capacities!
    return !matchingBox;
  }, [state.products, totalVolume, totalWeight, totalPrice, sortedCustomBoxes]);

  const toggleProduct = useCallback((id: any) => {
    const isAdding = !state.products.includes(id);

    if (isAdding) {
      const prod = productsList.find(p => String(p.id) === String(id));
      if (!prod || checkIsProductDisabled(prod)) {
        return;
      }
    }

    const nextProducts = state.products.includes(id)
      ? state.products.filter((productId) => String(productId) !== String(id))
      : [...state.products, id];

    update({ products: nextProducts, boxType: "custom" });
  }, [state.products, productsList, checkIsProductDisabled, update]);

  function handleFeaturedScroll() {
    const el = featuredScrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  }

  function scrollFeatured(dir: 1 | -1) {
    const el = featuredScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto shrink-0">
        <OnboardingStepper currentStep={3} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[1400px] w-full mx-auto px-8 pt-3 pb-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => update({ boxType: "signature", products: [] })}
              className={`rounded-2xl px-6 py-5 text-center transition-all duration-200 border-2 ${
                !isCustom
                  ? "text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-900 hover:border-gray-300"
              }`}
              style={!isCustom ? { backgroundColor: state.primaryColor, borderColor: state.primaryColor } : {}}
            >
              <div className="font-bold text-base mb-1">Consuetudo Signature</div>
              <p className={`text-xs leading-relaxed ${!isCustom ? "text-white/85" : "text-gray-500"}`}>
                Let our experts do the magic. Meticulously curated, perfectly balanced collections.
              </p>
            </button>
            <button
              type="button"
              onClick={() => update({ boxType: "custom" })}
              className={`rounded-2xl px-6 py-5 text-center transition-all duration-200 border-2 ${
                isCustom
                  ? "text-white shadow-sm"
                  : "bg-white border-gray-200 text-gray-900 hover:border-gray-300"
              }`}
              style={isCustom ? { backgroundColor: state.primaryColor, borderColor: state.primaryColor } : {}}
            >
              <div className="font-bold text-base mb-1">Build Your Own</div>
              <p className={`text-xs leading-relaxed ${isCustom ? "text-white/85" : "text-gray-500"}`}>
                You&apos;ve already chosen your products. Pick your box size and make it yours.
              </p>
            </button>
          </div>

          {isCustom ? (
            <div>
              <div className="text-center mb-5">
                <h2 className="text-[#ec2626] font-bold text-3xl mb-2">
                  Pick Your Products
                </h2>
                <p className="text-gray-500 text-sm">
                  Great choice of box! Pick at least {criteria.customBoxMinProducts} items.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const hasImg = Boolean(cat.img);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`relative rounded-full text-sm font-semibold border transition-colors ${
                        hasImg ? "pl-12 pr-6 py-2.5" : "px-6 py-2.5"
                      } ${
                        isActive
                          ? "bg-[#7c0404] border-[#7c0404] text-white"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {hasImg && cat.img ? (
                        <Image
                          src={cat.img}
                          alt=""
                          aria-hidden
                          className="absolute -left-3 -top-3 h-[60px] w-auto object-contain pointer-events-none drop-shadow-sm"
                        />
                      ) : null}
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-5">
                <div className="w-[200px] shrink-0 bg-[#f7f9f6] rounded-2xl p-4 border border-[#e1e9e0] shadow-sm flex flex-col gap-4">
                  <div className="text-center pb-2 border-b border-[#e1e9e0]">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Box Allocator</span>
                    <h3 className="text-xs font-bold text-[#7c0404] mt-0.5">Unlocking Criteria</h3>
                  </div>

                  {sortedCustomBoxes.map((box) => {
                    const isActive = activeCustomBox?.id === box.id;
                    return (
                      <LockedCustomBoxCard
                        key={box.id}
                        box={box}
                        isActive={isActive}
                        PRESET_IMAGE_MAP={PRESET_IMAGE_MAP}
                        onClick={() => setSelectedDetailsBox(box)}
                      />
                    );
                  })}

                  {/* Summary of current selections */}
                  <div className="mt-auto bg-white rounded-xl p-3 border border-[#e1e9e0] space-y-1.5 text-[10px] text-gray-500 shadow-inner">
                    <p className="font-bold text-[11px] text-gray-700 border-b pb-1">Current Cart Totals:</p>
                    <p className="flex justify-between">
                      <span>Total Volume:</span>
                      <span className="font-semibold text-gray-800">{totalVolume} cm³</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Total Weight:</span>
                      <span className="font-semibold text-gray-800">{totalWeight}g</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Total Value:</span>
                      <span className="font-semibold text-[#7c0404]">₹{totalPrice}</span>
                    </p>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-4 flex">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-yellow-300 text-white font-bold text-sm tracking-wide">
                      <Sparkles size={16} />
                      FEATURED FOR NAVRATRI
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      ref={featuredScrollRef}
                      onScroll={handleFeaturedScroll}
                      className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none] hardware-accelerated"
                    >
                      {featuredProducts.map((product) => (
                        <div key={product.id} className="snap-start shrink-0 w-[calc((100%-2rem)/3)]">
                          <ProductCard
                            product={product}
                            isSelected={state.products.includes(product.id)}
                            isDisabled={checkIsProductDisabled(product)}
                            onAdd={() => toggleProduct(product.id)}
                            onViewDetails={() => setSelectedDetailsProduct(product)}
                          />
                        </div>
                      ))}
                    </div>

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

                  <div className="mt-6 mb-4 flex">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-400 text-white font-bold text-sm tracking-wide">
                      <Sparkles size={16} />
                      ALL PRODUCTS
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 defer-render">
                    {allProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isSelected={state.products.includes(product.id)}
                        isDisabled={checkIsProductDisabled(product)}
                        onAdd={() => toggleProduct(product.id)}
                        onViewDetails={() => setSelectedDetailsProduct(product)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-[#ec2626] font-bold text-xl mb-2">
                  Choose Your Box Type
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-3xl mx-auto">
                  Go signature with a Consuetudo curated collection, or switch to Build Your Own for custom selections.
                </p>
              </div>
              <h3 className="text-[#ec2626] font-bold text-sm uppercase tracking-wide mb-5">
                Our Signature Collections
              </h3>
              <div className="grid grid-cols-4 gap-x-6 gap-y-8">
                {resolvedSignatureBoxes.map((box) => {
                  const isSelected = state.signatureBoxId === box.id;
                  return (
                    <SignatureBoxButton
                      key={box.id}
                      box={box}
                      isSelected={isSelected}
                      onClick={() => setCustomizingBox(box)}
                    />
                  );
                })}
              </div>
            </div>
          )}
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
              href="/onboarding/step2"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back
            </Link>
            <Link
              href="/onboarding/step6"
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm text-white transition-colors ${
                canProceed ? "bg-[#b91c1c] hover:bg-[#7c0404]" : "bg-[#b91c1c]/60 pointer-events-none"
              }`}
            >
              Next
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <PredefinedBoxCustomizerModal
        isOpen={customizingBox !== null}
        box={customizingBox}
        onClose={() => setCustomizingBox(null)}
        onConfirm={(selectedProductIds) => {
          update({
            boxType: "signature",
            signatureBoxId: customizingBox.id,
            products: selectedProductIds,
          });
        }}
      />
      <CustomBoxDetailsModal
        isOpen={selectedDetailsBox !== null}
        box={selectedDetailsBox}
        onClose={() => setSelectedDetailsBox(null)}
      />
      <ProductDetailsModal
        isOpen={selectedDetailsProduct !== null}
        product={selectedDetailsProduct}
        isSelected={selectedDetailsProduct ? state.products.includes(selectedDetailsProduct.id) : false}
        isDisabled={selectedDetailsProduct ? checkIsProductDisabled(selectedDetailsProduct) : false}
        onToggleAdd={() => selectedDetailsProduct && toggleProduct(selectedDetailsProduct.id)}
        onClose={() => setSelectedDetailsProduct(null)}
      />
    </div>
  );
}
