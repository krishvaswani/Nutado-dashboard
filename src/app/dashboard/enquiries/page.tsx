"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Eye, Inbox } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export default function EnquiriesPage() {
  const { orders, loading } = useOrders();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return (orders || []).filter((order) => {
      if (!order) return false;
      // Show ONLY Enquiries (status: 'pending')
      if (order.status !== "pending") return false;

      const orderNumber = order.orderNumber || "";
      const customer = order.customer || "";
      const company = order.company || "";
      
      const matchSearch =
        orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        customer.toLowerCase().includes(search.toLowerCase()) ||
        company.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [orders, search]);

  const enquiriesCount = filtered.length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-nutado-gray-900 flex items-center gap-2">
            <Inbox className="text-amber-500" size={24} /> Enquiries
          </h1>
          <p className="text-sm text-nutado-gray-500 mt-0.5">{enquiriesCount} pending lead enquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-nutado-gray-400" />
          <input
            type="text"
            placeholder="Search enquiries by lead ID, customer, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input-field pl-9 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200">
                {["Enquiry ID", "Customer", "Occasion", "Qty", "Estimated Value", "Created", "Status", ""].map((heading) => (
                  <th
                    key={heading}
                    className="text-left text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3 whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-nutado-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-nutado-gray-400 text-sm">
                    Loading lead enquiries...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-nutado-gray-400 text-sm">
                    No pending enquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const qty = order.quantity || 1;
                  const productsList = order.products || [];
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
                  const catalogProductSum = catalogPerBoxPrice * qty;
                  const catalogGrandTotal = Math.round((catalogProductSum + 1500) * 1.18);
                  const totalPricingDiscount = catalogGrandTotal > order.total ? catalogGrandTotal - order.total : 0;
                  const discountPercent = totalPricingDiscount > 0 ? Math.round((totalPricingDiscount / catalogGrandTotal) * 100) : 0;

                  return (
                    <tr key={order.id} className="hover:bg-nutado-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-amber-600">{order.orderNumber}</span>
                        <p className="text-xs text-nutado-gray-400 mt-0.5 capitalize">{order.boxType || "signature"} box</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-nutado-gray-900">{order.customer}</p>
                        <p className="text-xs text-nutado-gray-400">{order.company}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
                          {order.occasion}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-nutado-gray-700 font-medium">{order.quantity}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-nutado-gray-900">{formatCurrency(order.total)}</span>
                          {totalPricingDiscount > 0 && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] text-nutado-gray-400 line-through font-medium">
                                {formatCurrency(catalogGrandTotal)}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">
                                {discountPercent}% off
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-nutado-gray-600 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-nutado-gray-400 hover:text-nutado-green transition-colors inline-block">
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
