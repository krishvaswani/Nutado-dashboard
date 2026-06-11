"use client";

import { useState, useEffect } from "react";
import { X, Layers, Scale, DollarSign, Ruler, Sparkles } from "lucide-react";
import Image from "next/image";
import type { SignatureBoxRecord } from "@/types";

import box1 from "@/Assets/Slide3/box1.png";
import box2 from "@/Assets/Slide3/box 2.png";
import box3 from "@/Assets/Slide3/box3.png";
import box4 from "@/Assets/Slide3/box4.png";
import box5 from "@/Assets/Slide3/box5.png";
import box6 from "@/Assets/Slide3/box6.png";
import box7 from "@/Assets/Slide3/box7.png";
import box8 from "@/Assets/Slide3/box8.png";

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

interface CustomBoxDetailsModalProps {
  isOpen: boolean;
  box: SignatureBoxRecord | null;
  onClose: () => void;
}

export default function CustomBoxDetailsModal({
  isOpen,
  box,
  onClose,
}: CustomBoxDetailsModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Reset active image index when a new box is opened
  useEffect(() => {
    if (isOpen) {
      setActiveIdx(0);
    }
  }, [isOpen, box]);

  if (!isOpen || !box) return null;

  const imagesList = box.imageUrls && box.imageUrls.length > 0
    ? box.imageUrls
    : [box.imageUrl || "preset_1"];

  const currentImg = imagesList[activeIdx];
  const isPreset = currentImg ? currentImg.startsWith("preset_") : false;
  const resolveImg = isPreset ? PRESET_IMAGE_MAP[currentImg] || box1 : currentImg || box1;

  const boxVol = (Number(box.length) || 0) * (Number(box.width) || 0) * (Number(box.height) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-nutado-gray-150 shadow-elevated w-full max-w-2xl overflow-hidden relative flex flex-col p-6 animate-scale-up max-h-[92vh]">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-nutado-gray-100">
          <div className="flex items-center gap-2 text-nutado-green">
            <Layers size={20} />
            <h3 className="font-display font-bold text-lg text-nutado-gray-900">
              Box Specifications & Details
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

        {/* Modal body */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 my-4 overflow-y-auto pr-1">
          {/* Left Column: Image Preview Gallery */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-full aspect-[5/4] bg-nutado-gray-50 rounded-2xl flex items-center justify-center p-6 overflow-hidden relative border border-nutado-gray-100 shadow-inner select-none">
              {isPreset ? (
                <Image
                  src={resolveImg}
                  alt={box.label}
                  className="w-full h-full object-contain scale-110"
                />
              ) : (
                <img
                  src={currentImg}
                  alt={box.label}
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
            </div>

            {/* Thumbnail Switchers */}
            {imagesList.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {imagesList.map((img, idx) => {
                  const subIsPreset = img ? img.startsWith("preset_") : false;
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
                      {subIsPreset ? (
                        <Image
                          src={subResolveImg}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Specifications details */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-nutado-green">Gift Box Variant</span>
                <h4 className="font-display font-bold text-xl text-nutado-gray-900 leading-snug">
                  {box.label}
                </h4>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {/* Volume specs */}
                <div className="flex items-center gap-3 p-3 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                    <Layers size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-nutado-gray-400 uppercase block leading-none">Box Volume Capacity</span>
                    <span className="text-sm font-bold text-nutado-gray-800">{boxVol.toLocaleString()} cm³</span>
                  </div>
                </div>

                {/* Dimensions specs */}
                <div className="flex items-center gap-3 p-3 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                    <Ruler size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-nutado-gray-400 uppercase block leading-none">Box Dimensions (L × W × H)</span>
                    <span className="text-sm font-bold text-nutado-gray-800">{box.length || 0} × {box.width || 0} × {box.height || 0} cm</span>
                  </div>
                </div>

                {/* Weight limit capacity */}
                <div className="flex items-center gap-3 p-3 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 text-orange-500">
                    <Scale size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-nutado-gray-400 uppercase block leading-none">Weight Limit Capacity</span>
                    <span className="text-sm font-bold text-nutado-gray-800">{(box.weight || 0).toLocaleString()} grams (g)</span>
                  </div>
                </div>

                {/* Max price limit */}
                <div className="flex items-center gap-3 p-3 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0 text-red-500">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-nutado-gray-400 uppercase block leading-none">Max Value Limit Threshold</span>
                    <span className="text-sm font-bold text-nutado-gray-800">₹{(box.maxPrice || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note/Criteria info */}
            <div className="p-3 bg-brand-50/20 border border-nutado-green/10 rounded-xl flex gap-2.5 items-start">
              <Sparkles size={16} className="text-nutado-green shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-nutado-green font-medium">
                This box size is dynamically allocated based on the total dimensions, weight, and price of products added to your customized gift box.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Done Action */}
        <div className="w-full pt-3 border-t border-nutado-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-nutado-green hover:bg-nutado-green-dark text-white text-xs font-semibold rounded-lg shadow transition-colors"
            type="button"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
