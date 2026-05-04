"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Download, Eye } from "lucide-react";
import { MOCK_ORDERS } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import type { OrderStatus } from "@/types";
import { exportToCSV, formatOrdersForExport } from "@/lib/export";

const STATUS_FILTERS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-nutado-gray-900">Orders</h1>
          <p className="text-sm text-nutado-gray-500 mt-0.5">{MOCK_ORDERS.length} total orders</p>
        </div>
        <button
          onClick={() => exportToCSV(formatOrdersForExport(filtered), "nutado-orders.csv")}
          className="btn-secondary flex items-center gap-2 text-sm py-2.5"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
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
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === f.value
                  ? "bg-nutado-green text-white"
                  : "bg-nutado-gray-100 text-nutado-gray-600 hover:bg-nutado-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-nutado-gray-50 border-b border-nutado-gray-200">
                {["Order ID", "Customer", "Occasion", "Qty", "Total", "Delivery", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-nutado-gray-100">
              {filtered.length === 0 ? (
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

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-nutado-gray-100 flex items-center justify-between">
          <span className="text-xs text-nutado-gray-500">
            Showing {filtered.length} of {MOCK_ORDERS.length} orders
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  p === 1
                    ? "bg-nutado-green text-white"
                    : "text-nutado-gray-600 hover:bg-nutado-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
