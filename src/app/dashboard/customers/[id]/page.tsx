"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Mail, Phone, MapPin, Building,
  ShoppingBag, TrendingUp, Calendar, Package,
} from "lucide-react";
import { MOCK_CUSTOMERS, MOCK_ORDERS } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id) ?? MOCK_CUSTOMERS[0];

  // Filter orders for this customer (simulate by matching first 2 chars)
  const customerOrders = MOCK_ORDERS.slice(0, customer.totalOrders);
  const avgOrder = customer.totalOrders
    ? Math.round(customer.totalSpend / customer.totalOrders)
    : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/customers"
          className="flex items-center gap-1.5 text-sm text-nutado-gray-500 hover:text-nutado-green transition-colors mb-2"
        >
          <ChevronLeft size={15} /> Back to Customers
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-nutado-green text-white flex items-center justify-center text-xl font-bold shadow-sm">
              {customer.avatar}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-nutado-gray-900">
                {customer.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-nutado-gray-500">{customer.company}</span>
                <Badge variant={customer.status === "active" ? "green" : "gray"} dot>
                  {customer.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`mailto:${customer.email}`}
              className="btn-secondary flex items-center gap-2 text-sm py-2"
            >
              <Mail size={14} /> Email
            </Link>
            <button className="btn-primary flex items-center gap-2 text-sm py-2">
              <Package size={14} /> New Order
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: info + contact */}
        <div className="space-y-4">
          {/* Contact info */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">
              Contact Details
            </h2>
            <div className="space-y-3">
              {[
                { icon: Mail,     label: "Email",   value: customer.email },
                { icon: Phone,    label: "Phone",   value: customer.phone },
                { icon: Building, label: "Company", value: customer.company },
                { icon: MapPin,   label: "City",    value: "Mumbai, Maharashtra" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-nutado-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-nutado-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-nutado-gray-400 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-nutado-gray-900 truncate">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">
              Overview
            </h2>
            <div className="space-y-3">
              {[
                { icon: ShoppingBag,  label: "Total Orders",   value: String(customer.totalOrders), color: "bg-blue-50 text-blue-600" },
                { icon: TrendingUp,   label: "Lifetime Spend", value: formatCurrency(customer.totalSpend), color: "bg-green-50 text-green-600" },
                { icon: TrendingUp,   label: "Avg Order Value",value: formatCurrency(avgOrder), color: "bg-purple-50 text-purple-600" },
                { icon: Calendar,     label: "Last Order",     value: formatDate(customer.lastOrder), color: "bg-amber-50 text-amber-600" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="text-sm text-nutado-gray-500">{label}</span>
                    <span className="text-sm font-bold text-nutado-gray-900">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {["Corporate", "Diwali", "High Value", "Recurring"].map((tag) => (
                <Badge key={tag} variant="gray">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right: orders history */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order history */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-nutado-gray-100 flex items-center justify-between">
              <h2 className="font-display font-semibold text-nutado-gray-900">Order History</h2>
              <span className="text-xs text-nutado-gray-400">{customer.totalOrders} orders</span>
            </div>
            <div className="divide-y divide-nutado-gray-100">
              {customerOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-nutado-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={16} className="text-nutado-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-sm font-semibold text-nutado-green hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-nutado-gray-400 mt-0.5">
                      {order.quantity} boxes · {order.occasion} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-nutado-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-nutado-gray-400 mt-0.5">
                      Due {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {customer.totalOrders > customerOrders.length && (
              <div className="px-5 py-3 border-t border-nutado-gray-100 text-center">
                <button className="text-xs font-semibold text-nutado-green hover:text-nutado-green-dark">
                  Load more orders
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">
              Internal Notes
            </h2>
            <textarea
              rows={3}
              placeholder="Add a note about this customer..."
              className="input-field resize-none text-sm"
              defaultValue="VIP client — always orders before Diwali. Prefers premium packaging. Contact via email only."
            />
            <button className="mt-3 btn-primary text-sm py-2">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
