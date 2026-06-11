"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Layers, Scale, Ruler, Sparkles } from "lucide-react";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { subscribeProducts } from "@/lib/firebase/firestore";
import ProductIcon from "@/components/ui/ProductIcon";

import box1 from "@/Assets/Slide3/box1.png";
import box2 from "@/Assets/Slide3/box 2.png";
import box3 from "@/Assets/Slide3/box3.png";
import box4 from "@/Assets/Slide3/box4.png";
import box5 from "@/Assets/Slide3/box5.png";
import box6 from "@/Assets/Slide3/box6.png";
import box7 from "@/Assets/Slide3/box7.png";
import box8 from "@/Assets/Slide3/box8.png";

// Map premium assets
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

const DEFAULT_IMAGE_MAP: Record<number, any> = {
  1: box1,
  2: box2,
  3: box3,
  4: box4,
  5: box5,
  6: box6,
  7: box7,
  8: box8,
};

interface PredefinedBoxCustomizerModalProps {
  isOpen: boolean;
  box: {
    id: number | string;
    label: string;
    img: any;
    imageUrls?: string[];
    productIds: any[];
    optionalProductIds?: any[];
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    maxPrice?: number;
  } | null;
  onClose: () => void;
  onConfirm: (selectedProductIds: any[]) => void;
}

export default function PredefinedBoxCustomizerModal({
  isOpen,
  box,
  onClose,
  onConfirm,
}: PredefinedBoxCustomizerModalProps) {
  const [slots, setSlots] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>(MOCK_PRODUCTS);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const unsub = subscribeProducts((data) => {
      setProductsList(data);
    });
    return () => unsub();
  }, []);

  // Initialize slots and active image
  useEffect(() => {
    if (isOpen && box) {
      setActiveIdx(0);
      if (box.productIds && box.productIds.length > 0) {
        setSlots(box.productIds);
      } else {
        setSlots([2, 4, 3]); // Cashew pack, Dark Chocolate, Assorted Dry Fruits
      }
    }
  }, [isOpen, box]);

  if (!isOpen || !box) return null;

  // Compile images list
  const imagesList = box.imageUrls && box.imageUrls.length > 0
    ? box.imageUrls
    : [typeof box.img === "string" ? box.img : `preset_${box.id}`];

  const currentImg = imagesList[activeIdx];
  const isPresetString = typeof currentImg === "string" && currentImg.startsWith("preset_");
  const resolvedBoxImg = isPresetString
    ? PRESET_IMAGE_MAP[currentImg] || box1
    : typeof currentImg === "string"
    ? currentImg
    : typeof box.id === "number"
    ? DEFAULT_IMAGE_MAP[box.id] || box1
    : box.img || box1;

  const handleSwapProduct = (index: number, newProductId: any) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = newProductId;
      return next;
    });
  };

  const handleDone = () => {
    onConfirm(slots);
    onClose();
  };

  const hasDims = Boolean(box.length && box.width && box.height);
  const boxVol = hasDims ? (Number(box.length) || 0) * (Number(box.width) || 0) * (Number(box.height) || 0) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-nutado-gray-150 shadow-elevated w-full max-w-3xl overflow-hidden relative flex flex-col p-6 animate-scale-up max-h-[92vh]">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-nutado-gray-100">
          <div className="flex items-center gap-2 text-[#7c0404]">
            <Layers size={20} />
            <h3 className="font-display font-bold text-lg text-nutado-gray-900">
              Customize Curated Collection Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-nutado-gray-50 hover:bg-nutado-gray-150 transition-colors flex items-center justify-center text-nutado-gray-600"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal content body */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-4 overflow-y-auto pr-1">
          {/* Left Column: Image gallery and Specifications details */}
          <div className="space-y-4">
            <div className="w-full aspect-[5/4] bg-nutado-gray-50 rounded-2xl flex items-center justify-center p-6 overflow-hidden relative border border-nutado-gray-100 shadow-inner select-none">
              {typeof resolvedBoxImg === "string" ? (
                <img
                  src={resolvedBoxImg}
                  alt={box.label}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Image
                  src={resolvedBoxImg}
                  alt={box.label}
                  className="w-full h-full object-contain scale-110"
                  priority
                />
              )}
            </div>

            {/* Gallery Thumbnails switchers */}
            {imagesList.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {imagesList.map((img, idx) => {
                  const subIsPreset = typeof img === "string" && img.startsWith("preset_");
                  const subResolveImg = subIsPreset ? PRESET_IMAGE_MAP[img] || box1 : img;
                  const isActive = idx === activeIdx;

                  return (
                    <button
                      key={img + idx}
                      onClick={() => setActiveIdx(idx)}
                      type="button"
                      className={`w-12 h-12 rounded-lg border-2 overflow-hidden flex items-center justify-center p-1 bg-white transition-all ${
                        isActive ? "border-nutado-green scale-105 shadow-sm" : "border-nutado-gray-200 hover:border-nutado-gray-300"
                      }`}
                    >
                      {typeof subResolveImg === "string" ? (
                        <img
                          src={subResolveImg}
                          alt=""
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Image
                          src={subResolveImg}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Specifications specs box */}
            <div className="p-4 bg-nutado-gray-50 border border-nutado-gray-150 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-nutado-green">Curated Bundle Specs</span>
                <span className="px-2 py-0.5 bg-[#ec2626] text-white text-[9px] font-bold rounded-full">
                  Predefined Box
                </span>
              </div>
              <h4 className="font-bold text-sm text-nutado-gray-900 leading-none">{box.label}</h4>
              
              <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] text-nutado-gray-600">
                <div className="flex items-center gap-2">
                  <Ruler size={13} className="text-nutado-gray-400" />
                  <div>
                    <p className="text-[9px] font-bold text-nutado-gray-400 uppercase leading-none">Dimensions</p>
                    <p className="font-semibold mt-0.5 text-nutado-gray-800">
                      {hasDims ? `${box.length}×${box.width}×${box.height} cm` : "Standard Curated Size"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Layers size={13} className="text-nutado-gray-400" />
                  <div>
                    <p className="text-[9px] font-bold text-nutado-gray-400 uppercase leading-none">Volume Capacity</p>
                    <p className="font-semibold mt-0.5 text-nutado-gray-800">
                      {hasDims ? `${boxVol.toLocaleString()} cm³` : "Curated Fit Size"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 col-span-2">
                  <Scale size={13} className="text-nutado-gray-400" />
                  <div>
                    <p className="text-[9px] font-bold text-nutado-gray-400 uppercase leading-none">Weight Threshold Limit</p>
                    <p className="font-semibold mt-0.5 text-nutado-gray-800">
                      {box.weight ? `${box.weight.toLocaleString()} grams` : "Up to 1,500g capacity"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer list slot-swappers */}
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-nutado-gray-400 block mb-1">
                Customize Included Items
              </span>
              <div className="space-y-3.5 overflow-y-auto px-1 max-h-[50vh]">
                {slots.map((prodId, idx) => {
                  const currentProduct = productsList.find((p) => String(p.id) === String(prodId)) || productsList[0];

                  return (
                    <div
                      key={idx}
                      className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-nutado-gray-200 hover:border-nutado-green/30 transition-all shadow-sm gap-4"
                    >
                      {/* Product Thumbnail Art */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-nutado-gray-50 rounded-lg flex items-center justify-center overflow-hidden text-2xl shadow-inner shrink-0 border border-nutado-gray-100 select-none">
                          {currentProduct.imageUrl ? (
                            <img src={currentProduct.imageUrl} alt={currentProduct.name} className="w-full h-full object-cover" />
                          ) : (
                            <ProductIcon category={currentProduct.category} name={currentProduct.name} size={18} className="w-8 h-8" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-nutado-gray-900 leading-snug uppercase tracking-tight truncate">
                            {currentProduct.name}
                          </h5>
                          <p className="text-[10px] text-nutado-gray-400 font-semibold uppercase mt-0.5">
                            {currentProduct.brand} • ₹{currentProduct.price}
                          </p>
                        </div>
                      </div>

                      {/* Dropdown Selector */}
                      <div className="relative shrink-0 w-[45%]">
                        <select
                          value={prodId}
                          onChange={(e) => handleSwapProduct(idx, e.target.value)}
                          className="w-full pl-3 pr-8 py-2 border border-nutado-gray-200 rounded-lg text-xs font-semibold text-nutado-gray-700 bg-white hover:border-nutado-gray-300 focus:outline-none focus:ring-1 focus:ring-nutado-green focus:border-nutado-green appearance-none cursor-pointer"
                        >
                          {(() => {
                            const available = box.optionalProductIds && box.optionalProductIds.length > 0
                              ? productsList.filter((p) => String(p.id) === String(prodId) || (box.optionalProductIds!.map(String).includes(String(p.id)) && !slots.map(String).includes(String(p.id))))
                              : productsList.filter((p) => String(p.id) === String(prodId) || !slots.map(String).includes(String(p.id)));

                            return available.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ));
                          })()}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-nutado-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note alert */}
            <div className="p-3 bg-brand-50/20 border border-nutado-green/10 rounded-xl flex gap-2.5 items-start mt-2">
              <Sparkles size={16} className="text-nutado-green shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-[#7c0404] font-medium">
                Switch any product above with our premium alternatives. All selections will preserve our strict freshness and quality curation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Done Action Button */}
        <div className="w-full pt-3 border-t border-nutado-gray-100 flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-nutado-gray-300 text-nutado-gray-700 bg-white rounded-lg hover:bg-nutado-gray-50 transition-colors text-xs font-semibold"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-6 py-2.5 bg-[#b91c1c] hover:bg-[#7c0404] text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
            type="button"
          >
            Confirm & Save Box
          </button>
        </div>
      </div>
    </div>
  );
}
