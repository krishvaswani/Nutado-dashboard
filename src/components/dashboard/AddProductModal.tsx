"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Upload, Trash2 } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (product: Record<string, any>) => void;
  editingProduct?: any;
}

const DEFAULT_CATEGORIES = [
  "nuts",
  "chocolates",
  "dry-fruits",
  "cookies",
  "sweets",
  "chips",
  "healthy",
  "tea",
  "makhana",
  "trail-mix",
  "seeds",
  "gifting"
];

export default function AddProductModal({ isOpen, onClose, onSave, editingProduct }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [customCategory, setCustomCategory] = useState("");
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "nuts",
    price: "",
    originalPrice: "",
    weight: "",
    shelfLife: "",
    minOrder: "10",
    imageUrl: "",
    length: "",
    width: "",
    height: "",
    volume: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setForm({
          name: editingProduct.name || "",
          brand: editingProduct.brand || "",
          category: editingProduct.category || "nuts",
          price: String(editingProduct.price) || "",
          originalPrice: String(editingProduct.originalPrice) || "",
          weight: editingProduct.weight || "",
          shelfLife: editingProduct.shelfLife || "",
          minOrder: String(editingProduct.minOrder) || "10",
          imageUrl: editingProduct.imageUrl || "",
          length: editingProduct.length ? String(editingProduct.length) : "",
          width: editingProduct.width ? String(editingProduct.width) : "",
          height: editingProduct.height ? String(editingProduct.height) : "",
          volume: editingProduct.volume ? String(editingProduct.volume) : "",
        });
        
        // Ensure editing category is in available categories
        if (editingProduct.category && !availableCategories.includes(editingProduct.category.toLowerCase())) {
          setAvailableCategories(prev => [...prev, editingProduct.category.toLowerCase()]);
        }
      } else {
        setForm({
          name: "",
          brand: "",
          category: "nuts",
          price: "",
          originalPrice: "",
          weight: "",
          shelfLife: "",
          minOrder: "10",
          imageUrl: "",
          length: "",
          width: "",
          height: "",
          volume: "",
        });
      }
      setErrors({});
      setCustomCategory("");
    }
  }, [isOpen, editingProduct]);

  // Real-time dynamic volume calculation when dimensions change
  useEffect(() => {
    const l = parseFloat(form.length);
    const w = parseFloat(form.width);
    const h = parseFloat(form.height);
    if (!isNaN(l) && !isNaN(w) && !isNaN(h)) {
      const vol = Math.round(l * w * h);
      setForm((prev) => ({ ...prev, volume: String(vol) }));
    }
  }, [form.length, form.width, form.height]);

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        set("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.brand.trim()) e.brand = "Brand is required";
    if (!form.price || isNaN(Number(form.price))) e.price = "Valid price required";
    if (!form.weight.trim()) e.weight = "Weight is required";
    
    if (form.category === "custom" && !customCategory.trim()) {
      e.category = "Custom category name is required";
    }
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const categoryVal = form.category === "custom" ? customCategory.trim().toLowerCase() : form.category;
      
      const productData = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: categoryVal,
        price: Number(form.price),
        originalPrice: Number(form.price),
        weight: form.weight.trim(),
        shelfLife: form.shelfLife.trim(),
        minOrder: Number(form.minOrder),
        imageUrl: form.imageUrl,
        length: form.length ? Number(form.length) : undefined,
        width: form.width ? Number(form.width) : undefined,
        height: form.height ? Number(form.height) : undefined,
        volume: form.volume ? Number(form.volume) : undefined,
      };

      onSave?.(productData);
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? "Edit Product Details" : "Add New Product"}
      description="Fill in the product and volume specifications below"
      size="lg"
    >
      <div className="space-y-5 max-h-[78vh] overflow-y-auto pr-1">
        {/* Product Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-nutado-gray-700 mb-2">Product Image</label>
          {form.imageUrl ? (
            <div className="relative w-full h-44 bg-nutado-gray-50 rounded-xl overflow-hidden border border-nutado-gray-200 flex items-center justify-center group/img">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => set("imageUrl", "")}
                className="absolute top-2 right-2 p-2 bg-white/95 text-red-500 hover:text-red-700 hover:bg-white rounded-full shadow-md transition-all flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-nutado-gray-200 hover:border-nutado-green hover:bg-brand-50/5 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all">
              <div className="w-10 h-10 bg-nutado-gray-100 rounded-lg flex items-center justify-center mb-2 text-nutado-gray-500">
                <Upload size={18} />
              </div>
              <span className="text-sm font-semibold text-nutado-gray-700">Click to upload product image</span>
              <span className="text-xs text-nutado-gray-400 mt-1">PNG, JPG or WEBP up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
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
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Category *</label>
            <select
              className={`input-field capitalize ${errors.category ? "border-red-400" : ""}`}
              value={form.category}
              onChange={(e) => {
                set("category", e.target.value);
                if (e.target.value !== "custom") {
                  setCustomCategory("");
                }
              }}
            >
              {availableCategories.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c.replace("-", " ")}
                </option>
              ))}
              <option value="custom" className="text-nutado-green font-semibold bg-brand-50">
                + Add Custom Category
              </option>
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>

          {form.category === "custom" && (
            <div className="col-span-2 bg-brand-50/10 border border-brand-100 p-3.5 rounded-xl animate-fade-in flex flex-col gap-2">
              <label className="block text-xs font-semibold text-nutado-green uppercase tracking-wider">
                Create Custom Category
              </label>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1"
                  placeholder="e.g. Organic Seeds"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = customCategory.trim();
                    if (trimmed) {
                      const lower = trimmed.toLowerCase();
                      if (!availableCategories.includes(lower)) {
                        setAvailableCategories((prev) => [...prev, lower]);
                      }
                      set("category", lower);
                    }
                  }}
                  className="px-4 py-2 bg-nutado-green text-white font-semibold text-sm rounded-lg hover:bg-nutado-green-dark transition-all shrink-0"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-nutado-gray-700 mb-1.5">Price (₹) *</label>
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

          {/* Physical Dimensions & Volumetric Info */}
          <div className="col-span-2 mt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-nutado-gray-400 mb-3">
              Dimensions & Volumetric Weight
            </h3>
            <div className="grid grid-cols-4 gap-3 bg-nutado-gray-50/50 p-4 rounded-xl border border-nutado-gray-100">
              <div>
                <label className="block text-xs font-semibold text-nutado-gray-600 mb-1">Length (cm)</label>
                <input
                  type="number"
                  step="any"
                  className="input-field bg-white text-xs py-2"
                  placeholder="L"
                  value={form.length}
                  onChange={(e) => set("length", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-nutado-gray-600 mb-1">Width (cm)</label>
                <input
                  type="number"
                  step="any"
                  className="input-field bg-white text-xs py-2"
                  placeholder="W"
                  value={form.width}
                  onChange={(e) => set("width", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-nutado-gray-600 mb-1">Height (cm)</label>
                <input
                  type="number"
                  step="any"
                  className="input-field bg-white text-xs py-2"
                  placeholder="H"
                  value={form.height}
                  onChange={(e) => set("height", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-nutado-gray-600 mb-1">Volume (cm³)</label>
                <input
                  type="number"
                  step="any"
                  className="input-field bg-white text-xs py-2 font-mono font-semibold"
                  placeholder="Vol"
                  value={form.volume}
                  onChange={(e) => set("volume", e.target.value)}
                />
              </div>
            </div>
            <p className="text-[10px] text-nutado-gray-400 mt-1.5 pl-1">
              * Volume is dynamically calculated based on Length × Width × Height but can be customized manually.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-3 border-t border-nutado-gray-100">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit} loading={loading}>
            {editingProduct ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
