"use client";

import Link from "next/link";
import { ArrowRight, Package, ShoppingBag, TrendingUp, Users, Inbox, Award } from "lucide-react";
import { useMemo, useState } from "react";
import SelectCustomerModal from "@/components/dashboard/SelectCustomerModal";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { orders, loading } = useOrders();
  const [selectCustomerOpen, setSelectCustomerOpen] = useState(false);

  const stats = useMemo(() => {
    const enquiriesCount = orders.filter((order) => order.status === "pending").length;
    const acceptedOrders = orders.filter((order) => order.status !== "pending");
    const revenue = acceptedOrders.reduce((sum, order) => sum + order.total, 0);
    const activeCustomers = new Set(acceptedOrders.map((order) => order.customerId).filter(Boolean));
    const openOrdersCount = acceptedOrders.filter((order) =>
      ["processing", "shipped"].includes(order.status),
    ).length;

    return [
      {
        label: "Total Enquiries",
        value: `${enquiriesCount}`,
        change: "Pending action",
        changeType: "up" as const,
        Icon: Inbox,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        label: "Total Orders",
        value: `${acceptedOrders.length}`,
        change: "Live",
        changeType: "up" as const,
        Icon: ShoppingBag,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        label: "Open Orders",
        value: `${openOrdersCount}`,
        change: "In queue",
        changeType: "up" as const,
        Icon: Package,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        label: "Active Clients",
        value: `${activeCustomers.size}`,
        change: "Linked",
        changeType: "up" as const,
        Icon: Users,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      {
        label: "Revenue",
        value: formatCurrency(revenue),
        change: "Gross",
        changeType: "up" as const,
        Icon: TrendingUp,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ];
  }, [orders]);

  const recentEnquiries = useMemo(() => {
    return orders.filter((order) => order.status === "pending").slice(0, 6);
  }, [orders]);

  const topClients = useMemo(() => {
    const clientMap: { [key: string]: { name: string; company: string; totalSpend: number; orderCount: number } } = {};
    
    orders.forEach((order) => {
      // Spend calculations apply to live orders (non-pending and non-cancelled)
      if (order.status === "pending" || order.status === "cancelled") return;
      const key = `${order.customer}||${order.company}`;
      if (!clientMap[key]) {
        clientMap[key] = {
          name: order.customer,
          company: order.company,
          totalSpend: 0,
          orderCount: 0
        };
      }
      clientMap[key].totalSpend += order.total;
      clientMap[key].orderCount += 1;
    });

    return Object.values(clientMap)
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 10);
  }, [orders]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-nutado-gray-900">
            Welcome back, {profile?.name?.split(" ")[0] ?? "Team"}
          </h1>
          <p className="text-nutado-gray-500 text-sm mt-1">
            Your employee workspace is reading live order data from Firebase.
          </p>
        </div>
        <button
          onClick={() => setSelectCustomerOpen(true)}
          className="btn-primary flex items-center gap-2 text-sm hidden sm:flex font-semibold hover:opacity-95 transition-all"
        >
          Place Order For Client <ArrowRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries Card (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-nutado-gray-100">
            <div>
              <h3 className="font-display font-semibold text-nutado-gray-900">Recent Enquiries</h3>
              <p className="text-xs text-nutado-gray-400 mt-1">
                Pending lead enquiries requiring tele-caller follow-up and confirmation
              </p>
            </div>
            <Link href="/dashboard/enquiries" className="text-sm font-semibold text-nutado-green hover:underline">
              View all
            </Link>
          </div>

          <div className="divide-y divide-nutado-gray-100">
            {loading ? (
              <div className="px-5 py-8 text-sm text-nutado-gray-400 animate-pulse">Loading pending enquiries...</div>
            ) : recentEnquiries.length === 0 ? (
              <div className="px-5 py-8 text-sm text-nutado-gray-400">
                No pending enquiries found. Great job!
              </div>
            ) : (
              recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-nutado-gray-50/40 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-amber-600">{enquiry.orderNumber}</p>
                    <p className="text-sm font-bold text-nutado-gray-900 mt-1">
                      {enquiry.customer} · <span className="text-nutado-gray-500 font-semibold">{enquiry.company}</span>
                    </p>
                    <p className="text-xs text-nutado-gray-400 mt-1 flex items-center gap-1.5">
                      <span>{enquiry.quantity} boxes</span> · <span>{enquiry.occasion}</span>
                      {enquiry.followUps && enquiry.followUps.length > 0 && (
                        <span className="inline-block px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-100">
                          {enquiry.followUps.length} follow-up(s)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={enquiry.status} />
                    <p className="text-sm font-bold text-nutado-gray-900 mt-2">
                      {formatCurrency(enquiry.total)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top 10 Clients Card (1 Column) */}
        <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden flex flex-col h-fit">
          <div className="px-5 py-4 border-b border-nutado-gray-100 flex items-center gap-2 bg-gradient-to-r from-amber-50/20 to-transparent">
            <Award className="text-amber-500 animate-bounce" size={20} />
            <div>
              <h3 className="font-display font-semibold text-nutado-gray-900">Top 10 Clients</h3>
              <p className="text-xs text-nutado-gray-400 mt-0.5">Ranked by total overall order spend</p>
            </div>
          </div>

          <div className="divide-y divide-nutado-gray-100 max-h-[460px] overflow-y-auto">
            {loading ? (
              <div className="px-5 py-8 text-sm text-nutado-gray-400 animate-pulse">Loading top clients...</div>
            ) : topClients.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-nutado-gray-400">
                No active client billing records found.
              </div>
            ) : (
              topClients.map((client, index) => {
                const badgeColor = index === 0
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : index === 1
                  ? "bg-slate-100 text-slate-800 border-slate-200"
                  : index === 2
                  ? "bg-orange-100 text-orange-800 border-orange-200"
                  : "bg-nutado-gray-50 text-nutado-gray-500 border-nutado-gray-200";

                return (
                  <div key={index} className="px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-nutado-gray-50/50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center text-xs font-bold rounded-full border shadow-sm ${badgeColor}`}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-nutado-gray-900 truncate">{client.name}</p>
                        <p className="text-[10px] text-nutado-gray-400 truncate">{client.company}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-nutado-green">{formatCurrency(client.totalSpend)}</p>
                      <p className="text-[9px] text-nutado-gray-400 font-semibold">{client.orderCount} orders</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <SelectCustomerModal
        isOpen={selectCustomerOpen}
        onClose={() => setSelectCustomerOpen(false)}
      />
    </div>
  );
}
