import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import Link from "next/link";
import { MOCK_ORDERS } from "@/lib/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";

const STATS = [
  {
    label: "Total Orders",
    value: "1,284",
    change: "12%",
    changeType: "up" as const,
    Icon: ShoppingBag,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Active Products",
    value: "86",
    change: "5%",
    changeType: "up" as const,
    Icon: Package,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Customers",
    value: "3,421",
    change: "8%",
    changeType: "up" as const,
    Icon: Users,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    label: "Revenue (Oct)",
    value: "₹5.2L",
    change: "22%",
    changeType: "up" as const,
    Icon: TrendingUp,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

const UPCOMING = MOCK_ORDERS.filter(
  (o) => o.status === "processing" || o.status === "pending"
).slice(0, 3);

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-nutado-gray-900">
            Good morning, John 👋
          </h1>
          <p className="text-nutado-gray-500 text-sm mt-1">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <Link href="/onboarding/step1" className="btn-primary flex items-center gap-2 text-sm hidden sm:flex">
          New Order <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-nutado-gray-100">
            <h3 className="font-display font-semibold text-nutado-gray-900">Upcoming</h3>
            <Clock size={16} className="text-nutado-gray-400" />
          </div>
          <div className="divide-y divide-nutado-gray-100">
            {UPCOMING.map((order) => (
              <div key={order.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-semibold text-nutado-green">{order.orderNumber}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm font-medium text-nutado-gray-900 truncate">{order.company}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-nutado-gray-400">{order.quantity} boxes · {order.occasion}</span>
                  <span className="text-xs font-semibold text-nutado-gray-700">{formatCurrency(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-nutado-gray-100">
            <Link href="/dashboard/orders" className="text-xs font-semibold text-nutado-green hover:text-nutado-green-dark flex items-center gap-1">
              View all orders <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <RecentOrders />
    </div>
  );
}
