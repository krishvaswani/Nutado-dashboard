"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, Download, MessageSquare } from "lucide-react";
import { MOCK_ORDERS, MOCK_PRODUCTS } from "@/lib/mockData";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";

const TIMELINE: { status: string; label: string; time: string; done: boolean }[] = [
  { status: "confirmed",  label: "Order Confirmed",       time: "Oct 15, 9:02 AM",  done: true },
  { status: "processing", label: "Processing Started",    time: "Oct 15, 11:30 AM", done: true },
  { status: "packed",     label: "Packed & Ready",        time: "Oct 16, 3:00 PM",  done: true },
  { status: "shipped",    label: "Shipped",               time: "Oct 17, 9:00 AM",  done: false },
  { status: "delivered",  label: "Delivered",             time: "Oct 28 (expected)", done: false },
];

// Dummy line items for the order
const LINE_ITEMS = MOCK_PRODUCTS.slice(0, 3).map((p, i) => ({
  ...p,
  qty: [40, 50, 30][i],
}));

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = MOCK_ORDERS.find((o) => o.id === id) ?? MOCK_ORDERS[0];

  const subtotal  = LINE_ITEMS.reduce((sum, li) => sum + li.price * li.qty, 0);
  const packaging = 1500;
  const gst       = Math.round((subtotal + packaging) * 0.18);
  const total     = subtotal + packaging + gst;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Breadcrumb + header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1.5 text-sm text-nutado-gray-500 hover:text-nutado-green transition-colors mb-2"
          >
            <ChevronLeft size={15} /> Back to Orders
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display font-bold text-2xl text-nutado-gray-900">
              {order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-nutado-gray-500 mt-0.5">
            Placed on {formatDate(order.createdAt)} · {order.quantity} boxes · {order.occasion}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm py-2">
            <MessageSquare size={14} /> Contact
          </button>
          <button className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Download size={14} /> Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Line items */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-nutado-gray-100">
              <h2 className="font-display font-semibold text-nutado-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-nutado-gray-100">
              {LINE_ITEMS.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-12 h-12 rounded-xl bg-nutado-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-nutado-gray-900">{item.name}</p>
                    <p className="text-xs text-nutado-gray-400 mt-0.5">{item.brand} · {item.weight}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-nutado-gray-900">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                    <p className="text-xs text-nutado-gray-400 mt-0.5">
                      ₹{item.price} × {item.qty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Price summary */}
            <div className="px-5 py-4 bg-nutado-gray-50 border-t border-nutado-gray-100 space-y-2">
              {[
                { label: "Subtotal",             value: formatCurrency(subtotal) },
                { label: "Branding & Packaging", value: formatCurrency(packaging) },
                { label: "GST (18%)",            value: formatCurrency(gst) },
                { label: "Delivery",             value: "Free" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-nutado-gray-500">{row.label}</span>
                  <span className={`font-medium ${row.value === "Free" ? "text-green-600" : "text-nutado-gray-900"}`}>
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="border-t border-nutado-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-nutado-gray-900">Total</span>
                <span className="font-bold text-nutado-green text-lg">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery timeline */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-5">Order Timeline</h2>
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-nutado-gray-200" />

              <div className="space-y-5">
                {TIMELINE.map((step, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    {/* Dot */}
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                        step.done
                          ? "bg-nutado-green border-nutado-green"
                          : "bg-white border-nutado-gray-300"
                      }`}
                    >
                      {step.done && (
                        <CheckCircle size={11} className="text-white" />
                      )}
                    </div>
                    <div className={step.done ? "" : "opacity-40"}>
                      <p className={`text-sm font-semibold ${step.done ? "text-nutado-gray-900" : "text-nutado-gray-500"}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-nutado-gray-400 mt-0.5">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Customer info */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">Customer</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-nutado-green text-white flex items-center justify-center font-bold text-sm">
                {order.customer.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-nutado-gray-900">{order.customer}</p>
                <p className="text-xs text-nutado-gray-400">{order.company}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-nutado-gray-500">
                <Mail size={13} className="flex-shrink-0" />
                <span>customer@{order.company.toLowerCase().replace(/\s/g, "")}.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-nutado-gray-500">
                <Phone size={13} className="flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-nutado-gray-500">
                <MapPin size={13} className="flex-shrink-0 mt-0.5" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-4">Delivery</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck size={15} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-nutado-gray-500">Carrier</p>
                  <p className="text-sm font-semibold text-nutado-gray-900">BlueDart Express</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package size={15} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-nutado-gray-500">Tracking ID</p>
                  <p className="text-sm font-semibold text-nutado-gray-900 font-mono">BD-4829173642</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={15} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-nutado-gray-500">Expected Delivery</p>
                  <p className="text-sm font-semibold text-nutado-gray-900">{formatDate(order.deliveryDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <h2 className="font-display font-semibold text-nutado-gray-900 mb-3">Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left text-sm px-3 py-2.5 rounded-lg bg-nutado-gray-50 hover:bg-nutado-gray-100 text-nutado-gray-700 font-medium transition-colors">
                📋 Duplicate Order
              </button>
              <button className="w-full text-left text-sm px-3 py-2.5 rounded-lg bg-nutado-gray-50 hover:bg-nutado-gray-100 text-nutado-gray-700 font-medium transition-colors">
                ✏️ Edit Order
              </button>
              <button className="w-full text-left text-sm px-3 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors">
                🗑️ Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
