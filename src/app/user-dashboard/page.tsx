"use client";

import Link from "next/link";
import { ArrowRight, Clock, Receipt, ShoppingBag, Inbox } from "lucide-react";
import { useMemo } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/utils";

export default function UserDashboardPage() {
  const { profile } = useAuth();
  const { orders, loading } = useOrders(profile?.uid, true);

  const stats = useMemo(() => {
    const enquiriesCount = orders.filter((order) => order.status === "pending").length;
    const acceptedOrders = orders.filter((order) => order.status !== "pending");
    const totalSpend = acceptedOrders.reduce((sum, order) => sum + order.total, 0);
    const openOrdersCount = acceptedOrders.filter((order) =>
      ["processing", "shipped"].includes(order.status),
    ).length;

    return [
      {
        label: "My Enquiries",
        value: `${enquiriesCount}`,
        change: "Under Review",
        changeType: "up" as const,
        Icon: Inbox,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        label: "My Orders",
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
        change: "Tracking",
        changeType: "up" as const,
        Icon: Clock,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        label: "Total Spend",
        value: formatCurrency(totalSpend),
        change: "Lifetime",
        changeType: "up" as const,
        Icon: Receipt,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ];
  }, [orders]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-nutado-gray-900">
            Hello, {profile?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="text-nutado-gray-500 text-sm mt-1">
            This workspace tracks the orders linked to your Firebase client account.
          </p>
        </div>
        <Link href="/onboarding/step1" className="btn-primary flex items-center gap-2 text-sm hidden sm:flex">
          Place Order <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-nutado-gray-100">
          <div>
            <h3 className="font-display font-semibold text-nutado-gray-900">Recent Orders</h3>
            <p className="text-xs text-nutado-gray-400 mt-1">
              Orders placed by you or placed on your behalf by the Nutado team
            </p>
          </div>
          <Link href="/user-dashboard/orders" className="text-sm font-semibold text-nutado-green">
            View all
          </Link>
        </div>

        <div className="divide-y divide-nutado-gray-100">
          {loading ? (
            <div className="px-5 py-8 text-sm text-nutado-gray-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="px-5 py-8 text-sm text-nutado-gray-400">
              No orders yet. Place your first order to see it here.
            </div>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div key={order.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-nutado-green">{order.orderNumber}</p>
                  <p className="text-sm font-medium text-nutado-gray-900 mt-1">
                    {order.occasion} · {order.quantity} boxes
                  </p>
                  <p className="text-xs text-nutado-gray-400 mt-1">{order.company}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <p className="text-sm font-semibold text-nutado-gray-900 mt-2">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
