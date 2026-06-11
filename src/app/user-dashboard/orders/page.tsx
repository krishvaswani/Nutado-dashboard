"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";

export default function UserOrdersPage() {
  const { profile } = useAuth();
  const { orders, loading } = useOrders(profile?.uid, true);
  const [search, setSearch] = useState("");

  const filtered = (orders || []).filter((order) => {
    if (!order) return false;
    const orderNumber = order.orderNumber || "";
    const company = order.company || "";
    const occasion = order.occasion || "";
    return (
      orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      occasion.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-nutado-gray-900">My Orders</h1>
        <p className="text-sm text-nutado-gray-500 mt-0.5">
          Orders linked to your client account
        </p>
      </div>

      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-nutado-gray-400" />
          <input
            type="text"
            placeholder="Search your orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200">
                {["Order ID", "Occasion", "Quantity", "Total", "Created", "Status", ""].map((heading) => (
                  <th key={heading} className="text-left text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3 whitespace-nowrap">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-nutado-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-nutado-gray-400 text-sm">
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-nutado-gray-400 text-sm">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-nutado-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-nutado-green">{order.orderNumber}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-nutado-gray-700">{order.occasion}</td>
                    <td className="px-5 py-4 text-sm text-nutado-gray-700">{order.quantity}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-nutado-gray-900">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-4 text-sm text-nutado-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/user-dashboard/orders/${order.id}`} className="text-nutado-gray-400 hover:text-nutado-green transition-colors inline-block">
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
