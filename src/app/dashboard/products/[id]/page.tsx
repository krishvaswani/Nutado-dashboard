"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Star, Package, Edit2, Trash2, TrendingUp, ShoppingBag } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id)) ?? MOCK_PRODUCTS[0];
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => { setDeleting(false); setShowDelete(false); }, 1500);
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/products"
          className="flex items-center gap-1.5 text-sm text-nutado-gray-500 hover:text-nutado-green transition-colors mb-2"
        >
          <ChevronLeft size={15} /> Back to Products
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-nutado-gray-100 rounded-2xl flex items-center justify-center text-4xl">
              {product.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-2xl text-nutado-gray-900">
                  {product.name}
                </h1>
                {product.badge && (
                  <Badge variant="green">{product.badge}</Badge>
                )}
              </div>
              <p className="text-sm text-nutado-gray-500 mt-0.5">{product.brand}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary flex items-center gap-2 text-sm py-2">
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="space-y-4">
          {/* Pricing card */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">Pricing</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-nutado-gray-500">Selling Price</span>
                <span className="text-xl font-bold text-nutado-green">₹{product.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-nutado-gray-500">Original Price</span>
                <span className="text-sm text-nutado-gray-400 line-through">₹{product.originalPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-nutado-gray-500">Discount</span>
                <Badge variant="orange">{discount}% OFF</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-nutado-gray-500">Min. Order</span>
                <span className="text-sm font-semibold text-nutado-gray-900">{product.minOrder} units</span>
              </div>
            </div>
          </div>

          {/* Details card */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">Product Details</h2>
            <div className="space-y-3">
              {[
                { label: "Category",   value: product.category },
                { label: "Weight",     value: product.weight },
                { label: "Shelf Life", value: product.shelfLife },
                { label: "Brand",      value: product.brand },
                { label: "In Stock",   value: product.inStock ? "Yes" : "No" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-nutado-gray-500">{label}</span>
                  <span className={`text-sm font-semibold capitalize ${
                    label === "In Stock"
                      ? product.inStock ? "text-green-600" : "text-red-500"
                      : "text-nutado-gray-900"
                  }`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="gray">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Performance */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Star,        label: "Rating",    value: String(product.rating), sub: `${product.reviews.toLocaleString()} reviews`, bg: "bg-amber-50", color: "text-amber-500 fill-amber-400" },
              { icon: ShoppingBag, label: "Orders",    value: "284",  sub: "this year",   bg: "bg-blue-50",  color: "text-blue-500" },
              { icon: TrendingUp,  label: "Revenue",   value: "₹84K", sub: "this year",   bg: "bg-green-50", color: "text-green-600" },
            ].map(({ icon: Icon, label, value, sub, bg, color }) => (
              <div key={label} className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-4 text-center">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <p className="font-display font-bold text-xl text-nutado-gray-900">{value}</p>
                <p className="text-xs text-nutado-gray-500 mt-0.5">{label}</p>
                <p className="text-[10px] text-nutado-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Monthly performance mini chart */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">Monthly Orders</h2>
            <div className="flex items-end gap-1.5 h-28">
              {[12, 18, 14, 22, 19, 28, 24, 31, 29, 42, 38, 26].map((val, i) => {
                const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
                const max = 42;
                const isOct = i === 9;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full relative flex justify-center">
                      <div className="absolute bottom-full mb-1 hidden group-hover:block z-10">
                        <div className="bg-nutado-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold whitespace-nowrap">
                          {val}
                        </div>
                      </div>
                      <div
                        className={`w-full rounded-t-md transition-all ${isOct ? "bg-nutado-green" : "bg-nutado-green/25 group-hover:bg-nutado-green/50"}`}
                        style={{ height: `${(val / max) * 7}rem` }}
                      />
                    </div>
                    <span className={`text-[9px] font-medium ${isOct ? "text-nutado-green font-bold" : "text-nutado-gray-400"}`}>
                      {months[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description + packaging */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">Description</h2>
            <p className="text-sm text-nutado-gray-600 leading-relaxed">
              A carefully curated selection of premium {product.category} sourced from trusted suppliers
              across India. Each unit is hygienically packed with airtight sealing to ensure freshness.
              Available in custom branding options with minimum order of {product.minOrder} units.
            </p>
            <div className="mt-4 pt-4 border-t border-nutado-gray-100">
              <h3 className="text-sm font-semibold text-nutado-gray-700 mb-3">Packaging Options</h3>
              <div className="grid grid-cols-3 gap-3">
                {["Standard Box", "Premium Box", "Luxury Hamper"].map((pkg) => (
                  <div key={pkg} className="p-3 rounded-lg border border-nutado-gray-200 text-center hover:border-nutado-green transition-colors cursor-pointer">
                    <div className="text-2xl mb-1">📦</div>
                    <p className="text-xs font-semibold text-nutado-gray-700">{pkg}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
