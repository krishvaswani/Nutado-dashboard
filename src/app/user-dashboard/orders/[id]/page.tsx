"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Download, Tag } from "lucide-react";
import { useOrder } from "@/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export default function UserOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { order, loading } = useOrder(id);

  if (loading) {
    return <div className="text-sm text-nutado-gray-400 p-6 font-medium animate-pulse">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-sm text-red-600 p-6 font-semibold">Order not found.</div>;
  }

  const quantity = order.quantity || 1;
  const productsList = order.products || [];

  // Catalog original pricing calculation (before overwrite/discount)
  let catalogPerBoxPrice = 0;
  if (productsList.length === 0) {
    catalogPerBoxPrice = order.boxType === "signature" ? 699 : 449;
  } else {
    catalogPerBoxPrice = productsList.reduce((sum, p) => {
      const catalogProd = MOCK_PRODUCTS.find(
        (cp) => cp.id === p.id || cp.name.toLowerCase() === p.name.toLowerCase()
      );
      const origPrice = catalogProd ? catalogProd.price : (p.price || 0);
      return sum + origPrice * (p.quantity || 1);
    }, 0);
  }

  const catalogProductSum = catalogPerBoxPrice * quantity;
  const catalogGrandTotal = Math.round((catalogProductSum + 1500) * 1.18);
  const totalPricingDiscount = catalogGrandTotal > order.total ? catalogGrandTotal - order.total : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link
            href="/user-dashboard/orders"
            className="flex items-center gap-1.5 text-sm text-nutado-gray-500 hover:text-nutado-green transition-colors mb-2 font-medium"
          >
            <ChevronLeft size={15} /> Back to Orders
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display font-bold text-2xl text-nutado-gray-900">
              {order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-nutado-gray-500 mt-0.5 font-medium">
            Placed on {formatDate(order.createdAt)} · {order.quantity} boxes
          </p>
        </div>

        <button className="btn-secondary flex items-center gap-2 text-sm py-2 font-semibold">
          <Download size={14} /> Download Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-nutado-gray-100">
              <h2 className="font-display font-semibold text-nutado-gray-900">Order Summary</h2>
            </div>

            <div className="divide-y divide-nutado-gray-100">
              {[
                ["Company", order.company],
                ["Occasion", order.occasion],
                ["Quantity", `${order.quantity} boxes`],
                ["Box type", order.boxType || "signature"],
                ["Message template", order.messageTemplate || "—"],
              ].map(([label, value]) => (
                <div key={label} className="px-5 py-4 flex items-center justify-between">
                  <span className="text-sm text-nutado-gray-500 font-medium">{label}</span>
                  <span className="text-sm font-semibold text-nutado-gray-900 capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {productsList.length > 0 && (
            <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-nutado-gray-100">
                <h2 className="font-display font-semibold text-nutado-gray-900">Box Contents</h2>
              </div>
              <div className="divide-y divide-nutado-gray-100">
                {productsList.map((item) => {
                  const catalogProduct = MOCK_PRODUCTS.find(
                    (cp) => cp.id === item.id || cp.name.toLowerCase() === item.name.toLowerCase()
                  );
                  const defaultCatalogPrice = catalogProduct ? catalogProduct.price : undefined;
                  const hasDiscount = defaultCatalogPrice !== undefined && item.price !== undefined && item.price < defaultCatalogPrice;

                  return (
                    <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap sm:flex-nowrap">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-nutado-gray-900">{item.name}</p>
                        <p className="text-xs text-nutado-gray-400 mt-0.5">{item.brand || "Nutado catalog"}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          {hasDiscount && (
                            <span className="text-xs text-nutado-gray-400 line-through font-medium">
                              {formatCurrency(defaultCatalogPrice)}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-nutado-gray-700">
                            {item.price !== undefined ? formatCurrency(item.price) : "Included"}
                          </span>
                        </div>
                        {hasDiscount && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 mt-0.5 inline-block">
                            Saved {formatCurrency(defaultCatalogPrice - (item.price || 0))} ({Math.round(((defaultCatalogPrice - (item.price || 0)) / defaultCatalogPrice) * 100)}% off)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5 h-fit">
          <h2 className="font-display font-semibold text-nutado-gray-900 mb-4 flex items-center gap-1.5">
            <Tag size={16} className="text-nutado-green animate-pulse" /> Billing
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-nutado-gray-500 font-medium">Current total</span>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  {totalPricingDiscount > 0 && (
                    <span className="text-xs text-nutado-gray-400 line-through font-medium">
                      {formatCurrency(catalogGrandTotal)}
                    </span>
                  )}
                  <span className="font-bold text-nutado-green text-base">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {totalPricingDiscount > 0 && (
              <div className="flex justify-between items-center text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 font-bold transition-all duration-300">
                <span>Custom Gifting Discount</span>
                <span>-{formatCurrency(totalPricingDiscount)} ({Math.round((totalPricingDiscount / catalogGrandTotal) * 100)}% off)</span>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t border-nutado-gray-100">
              <span className="text-nutado-gray-500 font-medium">Delivery date</span>
              <span className="font-semibold text-nutado-gray-900">{formatDate(order.deliveryDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-nutado-gray-500 font-medium">Invoice status</span>
              <span className="font-semibold text-nutado-gray-900">
                {order.invoiceUrl ? "Available" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
