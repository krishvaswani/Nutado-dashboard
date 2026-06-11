"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import type { OrderStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: Exclude<OrderStatus, "pending"> | "all" }[] = [
  { label: "All Active", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return (orders || []).filter((order) => {
      if (!order) return false;
      // Exclude Enquiries (status: 'pending') from the active Orders view
      if (order.status === "pending") return false;

      const orderNumber = order.orderNumber || "";
      const customer = order.customer || "";
      const company = order.company || "";
      
      const matchSearch =
        orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        customer.toLowerCase().includes(search.toLowerCase()) ||
        company.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || order.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const acceptedOrdersCount = useMemo(() => {
    return (orders || []).filter((order) => order && order.status !== "pending").length;
  }, [orders]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-nutado-gray-900">Orders</h1>
          <p className="text-sm text-nutado-gray-500 mt-0.5">{acceptedOrdersCount} total orders</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-nutado-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={15} className="text-nutado-gray-400 flex-shrink-0" />
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === filter.value
                  ? "bg-nutado-green text-white"
                  : "bg-nutado-gray-100 text-nutado-gray-600 hover:bg-nutado-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200">
                {["Order ID", "Customer", "Occasion", "Qty", "Total", "Delivery", "Status", ""].map((heading) => (
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
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-nutado-gray-400 text-sm">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-nutado-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-nutado-green">{order.orderNumber}</span>
                      <p className="text-xs text-nutado-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-nutado-gray-900">{order.customer}</p>
                      <p className="text-xs text-nutado-gray-400">{order.company}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-1 bg-nutado-gray-100 text-nutado-gray-600 text-xs font-medium rounded-full">
                        {order.occasion}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-nutado-gray-700 font-medium">{order.quantity}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-nutado-gray-900">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-nutado-gray-600 whitespace-nowrap">
                      {formatDate(order.deliveryDate)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
