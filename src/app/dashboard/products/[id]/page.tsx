"use client";

export const dynamic = "force-dynamic";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, Package, Edit2, Trash2 } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProductIcon from "@/components/ui/ProductIcon";
import { subscribeProducts, deleteProduct } from "@/lib/firebase/firestore";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsub = subscribeProducts((data) => {
      const found = data.find((p) => String(p.id) === String(id));
      setProduct(found || null);
    });
    return () => unsub();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Package className="text-nutado-gray-300 animate-bounce" size={48} />
        <p className="text-sm font-semibold text-nutado-gray-500">Loading Product Specifications...</p>
      </div>
    );
  }

  const handleDelete = async () => {
    setDeleting(true);
    await deleteProduct(product.id);
    setDeleting(false);
    setShowDelete(false);
    router.push("/dashboard/products");
  };



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
            <div className="w-14 h-14 bg-nutado-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-nutado-gray-200">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ProductIcon category={product.category} name={product.name} size={24} className="w-10 h-10 shadow-sm" />
              )}
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
            <button
              onClick={() => {
                alert("To edit product details, please click 'Edit' directly from the grid or list card on the main products directory.");
              }}
              className="btn-secondary flex items-center gap-2 text-sm py-2"
            >
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
                <span className="text-sm text-nutado-gray-500">Price</span>
                <span className="text-xl font-bold text-nutado-green">₹{product.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-nutado-gray-500">Min. Order</span>
                <span className="text-sm font-semibold text-nutado-gray-900">{product.minOrder || 1} units</span>
              </div>
            </div>
          </div>

          {/* Details card */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">Product Details</h2>
            <div className="space-y-3">
              {[
                { label: "Category",      value: product.category },
                { label: "Weight",        value: product.weight },
                { label: "Dimensions",    value: product.length && product.width && product.height ? `${product.length} × ${product.width} × ${product.height} cm` : "Not specified" },
                { label: "Volume Taking", value: product.volume ? `${product.volume} cm³` : "Not specified" },
                { label: "Shelf Life",    value: product.shelfLife || "12 Months" },
                { label: "Brand",         value: product.brand },
                { label: "In Stock",      value: product.inStock !== false ? "Yes" : "No" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-nutado-gray-500">{label}</span>
                  <span className={`text-sm font-semibold capitalize ${
                    label === "In Stock"
                      ? product.inStock !== false ? "text-green-600" : "text-red-500"
                      : "text-nutado-gray-900"
                  }`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
              <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <Badge key={tag} variant="gray">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description + packaging */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">Description</h2>
            <p className="text-sm text-nutado-gray-600 leading-relaxed">
              A carefully curated selection of premium {product.category || "snack items"} sourced from trusted suppliers
              across India. Each unit is hygienically packed with airtight sealing to ensure freshness.
              Available in custom branding options with minimum order of {product.minOrder || 1} units.
            </p>
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
