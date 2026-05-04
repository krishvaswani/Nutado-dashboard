"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { ProductCategory } from "@/types";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (product: Record<string, unknown>) => void;
}

const CATEGORIES: ProductCategory[] = [
  "nuts", "chocolates", "dry-fruits", "cookies", "sweets", "chips", "healthy", "tea",
];

const EMOJIS = ["🎁", "🥜", "🍫", "🍇", "🍪", "🍬", "🥨", "💪", "☕", "✨", "🌿", "🍯"];

export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "nuts" as ProductCategory,
    price: "",
    originalPrice: "",
    weight: "",
    shelfLife: "",
    minOrder: "10",
    emoji: "🎁",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())          e.name = "Product name is required";
    if (!form.brand.trim())         e.brand = "Brand is required";
    if (!form.price || isNaN(Number(form.price))) e.price = "Valid price required";
    if (!form.weight.trim())        e.weight = "Weight is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    setTimeout(() => {
      onAdd?.({
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || Number(form.price),
        minOrder: Number(form.minOrder),
        rating: 0,
        reviews: 0,
        inStock: true,
        tags: [form.category],
      });
      setLoading(false);
      onClose();
      setForm({ name: "", brand: "", category: "nuts", price: "", originalPrice: "", weight: "", shelfLife: "", minOrder: "10", emoji: "🎁" });
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product" description="Fill in the product details below" size="lg">
      <div className="space-y-4">
        {/* Emoji picker */}
        <div>
          <label className="block text-sm font-medium text-nutado-gray-700 mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => set("emoji", e)}
                className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${
                  form.emoji === e
                    ? "bg-nutado-green/10 ring-2 ring-nutado-green"
                    : "bg-nutado-gray-100 hover:bg-nutado-gray-200"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Product Name *</label>
            <input
              className={`input-field ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-300" : ""}`}
              placeholder="e.g. Premium Cashew Pack"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Brand *</label>
            <input
              className={`input-field ${errors.brand ? "border-red-400" : ""}`}
              placeholder="e.g. Nutrado Select"
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
            />
            {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Category</label>
            <select
              className="input-field capitalize"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Selling Price (₹) *</label>
            <input
              type="number"
              className={`input-field ${errors.price ? "border-red-400" : ""}`}
              placeholder="e.g. 299"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Original Price (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 399"
              value={form.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Weight *</label>
            <input
              className={`input-field ${errors.weight ? "border-red-400" : ""}`}
              placeholder="e.g. 250g"
              value={form.weight}
              onChange={(e) => set("weight", e.target.value)}
            />
            {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Shelf Life</label>
            <input
              className="input-field"
              placeholder="e.g. 6 months"
              value={form.shelfLife}
              onChange={(e) => set("shelfLife", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Minimum Order Qty</label>
            <input
              type="number"
              className="input-field"
              min={1}
              value={form.minOrder}
              onChange={(e) => set("minOrder", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit} loading={loading}>
            Add Product
          </Button>
        </div>
      </div>
    </Modal>
  );
}
