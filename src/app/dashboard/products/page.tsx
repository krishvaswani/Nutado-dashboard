"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Search, LayoutGrid, List, Plus, Star, Gift, Package, Layers, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import type { SignatureBoxRecord } from "@/types";
const AddProductModal = dynamic(
  () => import("@/components/dashboard/AddProductModal"),
  { ssr: false }
);
const AddCustomBoxModal = dynamic(
  () => import("@/components/dashboard/AddCustomBoxModal"),
  { ssr: false }
);
import ProductIcon from "@/components/ui/ProductIcon";
import {
  subscribeSignatureBoxes,
  subscribeProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "@/lib/firebase/firestore";
import Image from "next/image";

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

const DEFAULT_CAT_LIST = [
  { label: "All", value: "all" },
  { label: "Nuts", value: "nuts" },
  { label: "Chocolates", value: "chocolates" },
  { label: "Dry Fruits", value: "dry-fruits" },
  { label: "Sweets", value: "sweets" },
  { label: "Chips", value: "chips" },
  { label: "Healthy", value: "healthy" },
  { label: "Cookies", value: "cookies" },
];

interface BoxCardProps {
  box: SignatureBoxRecord;
  productsList: any[];
  onEdit: (box: SignatureBoxRecord) => void;
}

function BoxCard({ box, productsList, onEdit }: BoxCardProps) {
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

  const isCustomBox = box.boxType === "custom";
  const currentImg = imagesList[activeIdx];
  const isPreset = currentImg ? currentImg.startsWith("preset_") : false;
  const resolveImg = isPreset ? PRESET_IMAGE_MAP[currentImg] || box1 : currentImg || box1;

  return (
    <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden hover:shadow-card-hover transition-all flex flex-col group/card h-full">
      {/* Image Area */}
      <div className="aspect-[5/4] bg-nutado-gray-50 flex items-center justify-center p-6 overflow-hidden relative border-b border-nutado-gray-100 select-none">
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
            className="w-full h-full object-cover"
          />
        )}

        {/* Carousel Chevrons (Visible on Hover if multi-image) */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-nutado-gray-700 p-1 rounded-full shadow-md hover:scale-105 transition-all opacity-0 group-hover/card:opacity-100 z-10 flex items-center justify-center"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-nutado-gray-700 p-1 rounded-full shadow-md hover:scale-105 transition-all opacity-0 group-hover/card:opacity-100 z-10 flex items-center justify-center"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>

            {/* Dots indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeIdx ? "bg-nutado-green w-3" : "bg-nutado-gray-300"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <span className={`absolute top-2 right-2 px-2 py-0.5 text-white text-[9px] font-bold rounded-full ${isCustomBox ? "bg-orange-500" : "bg-[#ec2626]"}`}>
          {isCustomBox ? "Custom Box" : `${box.productIds?.length || 0} Products`}
        </span>
      </div>

      {/* Box details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-nutado-gray-900 leading-snug truncate" title={box.label}>
              {box.label}
            </h4>
            <p className="text-[10px] text-nutado-gray-400 mt-1">
              Created {new Date(box.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEdit(box)}
            className="text-xs font-semibold text-[#ec2626] hover:text-[#c81010] hover:underline flex items-center gap-1 shrink-0"
          >
            Edit
          </button>
        </div>

        <div className="border-t border-nutado-gray-100 pt-2.5">
          {isCustomBox ? (
            <div className="space-y-1.5 text-xs text-nutado-gray-600">
              <p className="flex justify-between">
                <span className="font-semibold text-nutado-gray-400">Dimensions:</span>
                <span className="font-bold text-nutado-gray-800">{box.length || 0} × {box.width || 0} × {box.height || 0} cm</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-nutado-gray-400">Max Weight:</span>
                <span className="font-bold text-nutado-gray-800">{box.weight || 0}g</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-nutado-gray-400">Max Price:</span>
                <span className="font-bold text-nutado-gray-800">₹{box.maxPrice || 0}</span>
              </p>
            </div>
          ) : (
            <>
              <p className="text-[10px] uppercase font-bold tracking-wider text-nutado-gray-400 mb-1">
                Bundled Products:
              </p>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {(box.productIds || []).map((pid) => {
                  const found = productsList.find((p) => String(p.id) === String(pid));
                  if (!found) return null;
                  return (
                    <span
                      key={pid}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-nutado-gray-100 text-[10px] font-semibold text-nutado-gray-700 rounded"
                    >
                      <Package size={10} className="text-nutado-gray-400" />
                      {found.name.slice(0, 14)}
                    </span>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [productsList, setProductsList] = useState<any[]>(MOCK_PRODUCTS);

  const [activeTab, setActiveTab] = useState<"products" | "boxes">("products");
  const [customBoxes, setCustomBoxes] = useState<SignatureBoxRecord[]>([]);
  const [showAddBoxModal, setShowAddBoxModal] = useState(false);
  const [editingBox, setEditingBox] = useState<SignatureBoxRecord | null>(null);

  useEffect(() => {
    const unsub = subscribeSignatureBoxes((data) => {
      setCustomBoxes(data);
    });
    return () => unsub();
  }, []);

  // Listen to persistent products stream
  useEffect(() => {
    const unsub = subscribeProducts((data) => {
      setProductsList(data);
    });
    return () => unsub();
  }, []);

  // Dynamically compile categories to include custom ones
  const dynamicCategories = useMemo(() => {
    const list = [...DEFAULT_CAT_LIST];
    productsList.forEach((p) => {
      if (!p.category) return;
      const val = p.category.toLowerCase();
      if (!list.some((c) => c.value === val)) {
        list.push({
          label: p.category.charAt(0).toUpperCase() + p.category.slice(1).replace("-", " "),
          value: val,
        });
      }
    });
    return list;
  }, [productsList]);

  const filtered = useMemo(() => {
    return productsList.filter((p) => {
      const nameMatch = p.name ? p.name.toLowerCase().includes(search.toLowerCase()) : false;
      const brandMatch = p.brand ? p.brand.toLowerCase().includes(search.toLowerCase()) : false;
      const matchSearch = nameMatch || brandMatch;
      
      const categoryVal = p.category ? p.category.toLowerCase() : "";
      const matchCat = catFilter === "all" || categoryVal === catFilter.toLowerCase();
      
      return matchSearch && matchCat;
    });
  }, [productsList, search, catFilter]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-nutado-gray-900">Products & Collections</h1>
          <p className="text-sm text-nutado-gray-500 mt-0.5">
            Manage your premium product catalog and onboarding signature gift boxes.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-nutado-gray-200">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "products"
              ? "border-nutado-green text-nutado-green bg-brand-50/20"
              : "border-transparent text-nutado-gray-500 hover:text-nutado-gray-900"
          }`}
        >
          <Package size={16} /> Listed Products
        </button>
        <button
          onClick={() => setActiveTab("boxes")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "boxes"
              ? "border-nutado-green text-nutado-green bg-brand-50/20"
              : "border-transparent text-nutado-gray-500 hover:text-nutado-gray-900"
          }`}
        >
          <Layers size={16} /> Signature & Custom Boxes
        </button>
      </div>

      {activeTab === "products" && (
        <>
          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center animate-fade-in">
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
              {dynamicCategories.map((c) => (
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
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowAddModal(true);
              }}
              className="btn-primary flex items-center gap-2 text-xs py-2.5 rounded-lg font-semibold"
            >
              <Plus size={15} /> Add Product
            </button>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in defer-render">
              {filtered.map((product) => (
                <div key={product.id} className="relative group">
                  <Link href={`/dashboard/products/${product.id}`} className="bg-white rounded-xl border border-nutado-gray-200 shadow-card hover:shadow-card-hover hover:border-nutado-green/30 transition-all overflow-hidden block">
                    <div className="aspect-square bg-nutado-gray-50 flex items-center justify-center overflow-hidden relative">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ProductIcon category={product.category} name={product.name} size={40} className="w-20 h-20" />
                      )}
                    </div>
                    <div className="p-4">
                      {product.badge && (
                        <span className="inline-block px-2 py-0.5 bg-brand-50 text-nutado-green text-[10px] font-semibold rounded-full mb-1.5">
                          {product.badge}
                        </span>
                      )}
                      <p className="text-sm font-semibold text-nutado-gray-900 leading-tight truncate">{product.name}</p>
                      <p className="text-xs text-nutado-gray-400 mt-0.5">{product.brand}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium text-nutado-gray-700">{product.rating || 4.5}</span>
                        <span className="text-[10px] text-nutado-gray-400">({(product.reviews || 0).toLocaleString()})</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-sm font-bold text-nutado-green">₹{product.price}</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          product.inStock !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                        }`}>
                          {product.inStock !== false ? "In Stock" : "Out"}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingProduct(product);
                        setShowAddModal(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/95 shadow-sm text-blue-600 hover:text-white hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100"
                      title="Edit Product"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                          await deleteProduct(product.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-white/95 shadow-sm text-red-500 hover:text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Product"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden animate-fade-in">
              <table className="w-full">
                <thead>
                  <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200">
                    {["Product", "Brand", "Category", "Price", "Rating", "Stock", "Actions"].map((h) => (
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
                          <div className="w-10 h-10 bg-nutado-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-nutado-gray-100">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ProductIcon category={product.category} name={product.name} size={18} className="w-8 h-8" />
                            )}
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
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-nutado-gray-700">{product.rating || 4.5}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.inStock !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          {product.inStock !== false ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Link href={`/dashboard/products/${product.id}`} className="text-xs font-semibold text-nutado-green hover:underline">
                            View
                          </Link>
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowAddModal(true);
                            }}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                await deleteProduct(product.id);
                              }
                            }}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === "boxes" && (
        <div className="space-y-5 animate-fade-in">
          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-nutado-gray-900">
                Predefined & Custom Boxes ({customBoxes.length})
              </h2>
              <p className="text-xs text-nutado-gray-400 mt-0.5">
                Premium predefined collections and custom boxes with dimensions & limit criteria.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingBox(null);
                setShowAddBoxModal(true);
              }}
              className="btn-primary py-2.5 px-4 text-xs font-semibold flex items-center gap-2 bg-nutado-green text-white rounded-lg shadow-sm"
            >
              <Plus size={15} /> Create Box Option
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customBoxes.length === 0 ? (
              <div className="col-span-full py-12 text-center text-nutado-gray-400 bg-white rounded-xl border border-dashed border-nutado-gray-200">
                <Gift size={32} className="mx-auto mb-2 text-nutado-gray-300" />
                <p className="text-sm font-semibold text-nutado-gray-700">No Custom Boxes Created Yet</p>
                <p className="text-xs text-nutado-gray-400 mt-0.5">Create your first premium box option to get started!</p>
              </div>
            ) : (
              customBoxes.map((box) => (
                <BoxCard
                  key={box.id}
                  box={box}
                  productsList={productsList}
                  onEdit={(b) => {
                    setEditingBox(b);
                    setShowAddBoxModal(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct}
        onSave={async (savedProd) => {
          if (editingProduct) {
            // Update existing product in Firestore/LocalStorage
            await updateProduct(editingProduct.id, savedProd);
          } else {
            // Add new product to Firestore/LocalStorage
            await createProduct({
              ...savedProd,
              rating: 4.8,
              reviews: 1,
              badge: "New",
              inStock: true,
            });
          }
          setShowAddModal(false);
          setEditingProduct(null);
        }}
      />

      <AddCustomBoxModal
        isOpen={showAddBoxModal}
        onClose={() => {
          setShowAddBoxModal(false);
          setEditingBox(null);
        }}
        editingBox={editingBox}
        onSuccess={(box) => {
          console.log("Custom Box Action Success:", box);
          setEditingBox(null);
        }}
      />
    </div>
  );
}
