"use client";

import Link from "next/link";
import { useOnboarding } from "@/context/OnboardingContext";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { ChevronRight, ChevronLeft, Edit2, Info } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";

const BUNDLE_PRICES: Record<string, number> = {
  small: 499, medium: 449, large: 399, enterprise: 349,
};

export default function OnboardingStep7() {
  const { state } = useOnboarding();

  const unitPrice = BUNDLE_PRICES[state.bundleSize] ?? 449;
  const subtotal = unitPrice * state.quantity;
  const packaging = 1500;
  const gst = Math.round((subtotal + packaging) * 0.18);
  const total = subtotal + packaging + gst;

  const selectedProducts = MOCK_PRODUCTS.filter((p) =>
    state.products.includes(p.id)
  );

  const rows = [
    { label: "Occasion(s)",       value: state.occasions.length ? state.occasions.join(", ") : "—", step: "step1" },
    { label: "Categories",        value: state.categories.length ? state.categories.join(", ") : "—", step: "step2" },
    { label: "Products selected", value: selectedProducts.length ? `${selectedProducts.length} products` : "—", step: "step5" },
    { label: "Bundle size",       value: state.bundleSize ? `${state.bundleSize.charAt(0).toUpperCase() + state.bundleSize.slice(1)}` : "—", step: "step4" },
    { label: "Quantity",          value: `${state.quantity} boxes`, step: "step4" },
    { label: "Unit price",        value: `₹${unitPrice}/box`, step: "step4" },
    { label: "Brand name",        value: state.brandName || "Not set", step: "step6" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <OnboardingStepper currentStep={7} />

      <div className="bg-white rounded-2xl border border-nutado-gray-200 shadow-card overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-nutado-gray-100 flex items-start justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-nutado-gray-900">Review Your Order</h2>
            <p className="text-sm text-nutado-gray-500 mt-1">Almost there! Double-check everything before confirming.</p>
          </div>
          <button className="text-nutado-gray-400 hover:text-nutado-gray-600"><Info size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Summary table */}
          <div className="rounded-xl border border-nutado-gray-200 divide-y divide-nutado-gray-100 overflow-hidden">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-nutado-gray-500">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-nutado-gray-900 capitalize">{row.value}</span>
                  <Link href={`/onboarding/${row.step}`} className="text-nutado-gray-400 hover:text-nutado-green transition-colors">
                    <Edit2 size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Product thumbnails */}
          {selectedProducts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-nutado-gray-700 mb-3">Selected Products</h3>
              <div className="flex flex-wrap gap-3">
                {selectedProducts.map((p) => (
                  <div key={p.id} className="w-14 h-14 bg-nutado-gray-50 rounded-xl flex items-center justify-center text-3xl border border-nutado-gray-200" title={p.name}>
                    {p.emoji}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price breakdown */}
          <div className="bg-nutado-gray-50 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-nutado-gray-700">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-nutado-gray-500">{state.quantity} boxes × ₹{unitPrice}</span>
                <span className="font-medium text-nutado-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nutado-gray-500">Branding & Packaging</span>
                <span className="font-medium text-nutado-gray-900">₹{packaging.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nutado-gray-500">GST (18%)</span>
                <span className="font-medium text-nutado-gray-900">₹{gst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nutado-gray-500">Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-nutado-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-nutado-gray-900">Total</span>
                <span className="font-bold text-nutado-green text-lg">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex items-center justify-between">
          <Link href="/onboarding/step6" className="btn-secondary flex items-center gap-2">
            <ChevronLeft size={16} /> Back
          </Link>
          <Link href="/onboarding/step8" className="btn-primary flex items-center gap-2">
            Confirm Order <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
