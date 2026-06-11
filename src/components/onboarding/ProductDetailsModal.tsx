"use client";

import { X, Star, Scale, ShieldAlert, Award, Calendar, Layers, Check, Plus, Minus } from "lucide-react";
import ProductIcon from "@/components/ui/ProductIcon";
import type { Product } from "@/types";

interface ProductDetailsModalProps {
  isOpen: boolean;
  product: Product | null;
  isSelected: boolean;
  isDisabled: boolean;
  onToggleAdd: () => void;
  onClose: () => void;
}

export default function ProductDetailsModal({
  isOpen,
  product,
  isSelected,
  isDisabled,
  onToggleAdd,
  onClose,
}: ProductDetailsModalProps) {
  if (!isOpen || !product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productVolume = (product.length && product.width && product.height)
    ? product.length * product.width * product.height
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-nutado-gray-150 shadow-elevated w-full max-w-lg overflow-hidden relative flex flex-col p-6 animate-scale-up max-h-[92vh]">
        {/* Header close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-nutado-gray-50 hover:bg-nutado-gray-150 transition-colors flex items-center justify-center text-nutado-gray-600 z-10"
          type="button"
        >
          <X size={18} />
        </button>

        {/* Modal content body */}
        <div className="w-full flex-1 overflow-y-auto pr-1 my-2 space-y-5">
          {/* Hero image/icon preview area */}
          <div className="w-full aspect-[5/4] bg-nutado-gray-50 rounded-2xl flex items-center justify-center overflow-hidden relative border border-nutado-gray-100 shadow-inner select-none p-6">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-xl"
              />
            ) : (
              <ProductIcon category={product.category} name={product.name} size={64} className="w-28 h-28" />
            )}
            
            {/* Discount Badge */}
            {discount > 0 && (
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow">
                {discount}% OFF
              </span>
            )}

            {/* General Badge */}
            {product.badge && (
              <span className="absolute top-3 right-12 px-2.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full shadow">
                {product.badge}
              </span>
            )}
          </div>

          {/* Info section */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-nutado-green">{product.brand}</span>
              <h3 className="font-display font-bold text-xl text-nutado-gray-900 leading-tight uppercase mt-0.5">
                {product.name}
              </h3>
              
              {/* Rating & Stock */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-nutado-gray-800">{product.rating || 4.5}</span>
                  <span className="text-[10px] text-nutado-gray-400 font-semibold">({product.reviews || 120} reviews)</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-nutado-gray-300" />
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  product.inStock !== false ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                  {product.inStock !== false ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-2 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl p-3.5">
              <div>
                <span className="text-[9px] font-bold text-nutado-gray-400 uppercase block leading-none mb-1">Onboarding Offer Price</span>
                <span className="text-2xl font-black text-nutado-green leading-none">₹{product.price}</span>
              </div>
              {product.originalPrice > product.price && (
                <span className="text-xs text-nutado-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Product Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Weight Card */}
              <div className="flex items-center gap-2.5 p-2.5 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl">
                <Scale size={14} className="text-nutado-gray-400" />
                <div>
                  <span className="text-[9px] font-bold text-nutado-gray-400 uppercase block leading-none">Weight</span>
                  <span className="text-xs font-bold text-nutado-gray-800 mt-0.5 block">{product.weight}</span>
                </div>
              </div>

              {/* Shelf Life Card */}
              <div className="flex items-center gap-2.5 p-2.5 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl">
                <Calendar size={14} className="text-nutado-gray-400" />
                <div>
                  <span className="text-[9px] font-bold text-nutado-gray-400 uppercase block leading-none">Shelf Life</span>
                  <span className="text-xs font-bold text-nutado-gray-800 mt-0.5 block">{product.shelfLife || "9 Months"}</span>
                </div>
              </div>

              {/* Min Order Capacity */}
              <div className="flex items-center gap-2.5 p-2.5 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl">
                <Award size={14} className="text-nutado-gray-400" />
                <div>
                  <span className="text-[9px] font-bold text-nutado-gray-400 uppercase block leading-none">Min Order Qty</span>
                  <span className="text-xs font-bold text-nutado-gray-800 mt-0.5 block">{product.minOrder || 50} units</span>
                </div>
              </div>

              {/* Volume Specs */}
              <div className="flex items-center gap-2.5 p-2.5 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl">
                <Layers size={14} className="text-nutado-gray-400" />
                <div>
                  <span className="text-[9px] font-bold text-nutado-gray-400 uppercase block leading-none">Vol Capacity</span>
                  <span className="text-xs font-bold text-nutado-gray-800 mt-0.5 block">
                    {productVolume > 0 ? `${productVolume} cm³` : "Curated Size"}
                  </span>
                </div>
              </div>
            </div>

            {/* Individual dimensions details if present */}
            {Boolean(product.length && product.width && product.height) && (
              <div className="p-3 bg-nutado-gray-50 border border-nutado-gray-100 rounded-xl">
                <span className="text-[9px] font-bold text-nutado-gray-400 uppercase block mb-1">
                  Product Box Dimensions (L × W × H)
                </span>
                <span className="text-xs font-semibold text-nutado-gray-700">
                  {product.length}cm × {product.width}cm × {product.height}cm
                </span>
              </div>
            )}

            {/* Tags Pills Section */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-nutado-gray-400 uppercase block">Product Attributes</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-nutado-gray-50 text-[10px] font-semibold text-nutado-gray-600 rounded-full border border-nutado-gray-150 capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Done Action */}
        <div className="w-full pt-4 border-t border-nutado-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-nutado-gray-300 text-nutado-gray-700 bg-white rounded-lg hover:bg-nutado-gray-50 transition-colors text-xs font-semibold"
            type="button"
          >
            Cancel
          </button>
          
          <button
            onClick={() => {
              if (!isDisabled) {
                onToggleAdd();
                onClose();
              }
            }}
            disabled={isDisabled && !isSelected}
            className={`px-6 py-2.5 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
              isSelected
                ? "bg-red-600 hover:bg-red-700 text-white"
                : isDisabled
                ? "bg-nutado-gray-100 border border-nutado-gray-200 text-nutado-gray-400 cursor-not-allowed"
                : "bg-nutado-green hover:bg-nutado-green-dark text-white"
            }`}
            type="button"
          >
            {isSelected ? (
              <>
                <Minus size={14} /> Remove from Box
              </>
            ) : (
              <>
                <Plus size={14} /> Add to Box
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
