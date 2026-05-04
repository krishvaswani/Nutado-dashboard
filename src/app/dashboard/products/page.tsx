"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, LayoutGrid, List, Plus, Star } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import type { ProductCategory } from "@/types";
import AddProductModal from "@/components/dashboard/AddProductModal";

const CATEGORIES: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Nuts", value: "nuts" },
  { label: "Chocolates", value: "chocolates" },
  { label: "Dry Fruits", value: "dry-fruits" },
  { label: "Sweets", value: "sweets" },
  { label: "Chips", value: "chips" },
  { label: "Healthy", value: "healthy" },
  { label: "Cookies", value: "cookies" },
];

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<ProductCategory | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-nutado-gray-900">Products</h1>
          <p className="text-sm text-nutado-gray-500 mt-0.5">{MOCK_PRODUCTS.length} products in catalog</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm py-2.5">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-nutado-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCatFilter(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                catFilter === c.value
                  ? "bg-nutado-green text-white"
                  : "bg-nutado-gray-100 text-nutado-gray-600 hover:bg-nutado-gray-200"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex items-center border border-nutado-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <button
            onClick={() => setView("grid")}
            className={`p-2 transition-colors ${view === "grid" ? "bg-nutado-green text-white" : "text-nutado-gray-400 hover:bg-nutado-gray-50"}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 transition-colors ${view === "list" ? "bg-nutado-green text-white" : "text-nutado-gray-400 hover:bg-nutado-gray-50"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid view */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <Link key={product.id} href={`/dashboard/products/${product.id}`} className="bg-white rounded-xl border border-nutado-gray-200 shadow-card hover:shadow-card-hover hover:border-nutado-green/30 transition-all overflow-hidden block">
              <div className="aspect-square bg-nutado-gray-50 flex items-center justify-center text-5xl p-6">
                {product.emoji}
              </div>
              <div className="p-4">
                {product.badge && (
                  <span className="inline-block px-2 py-0.5 bg-brand-50 text-nutado-green text-[10px] font-semibold rounded-full mb-1.5">
                    {product.badge}
                  </span>
                )}
                <p className="text-sm font-semibold text-nutado-gray-900 leading-tight">{product.name}</p>
                <p className="text-xs text-nutado-gray-400 mt-0.5">{product.brand}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-nutado-gray-700">{product.rating}</span>
                  <span className="text-[10px] text-nutado-gray-400">({product.reviews.toLocaleString()})</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-sm font-bold text-nutado-green">₹{product.price}</span>
                    <span className="text-[11px] text-nutado-gray-400 line-through ml-1">₹{product.originalPrice}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    product.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                  }`}>
                    {product.inStock ? "In Stock" : "Out"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200">
                {["Product", "Brand", "Category", "Price", "Rating", "Stock", ""].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-nutado-gray-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-nutado-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-nutado-gray-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                        {product.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-nutado-gray-900">{product.name}</p>
                        {product.badge && <span className="text-[10px] text-nutado-green font-medium">{product.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-nutado-gray-600">{product.brand}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium px-2 py-1 bg-nutado-gray-100 text-nutado-gray-600 rounded-full capitalize">{product.category}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-bold text-nutado-green">₹{product.price}</span>
                    <span className="text-xs text-nutado-gray-400 line-through ml-1">₹{product.originalPrice}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-nutado-gray-700">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/dashboard/products/${product.id}`} className="text-xs font-semibold text-nutado-green hover:text-nutado-green-dark transition-colors">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(p) => console.log("New product:", p)}
      />
    </div>
  );
}
