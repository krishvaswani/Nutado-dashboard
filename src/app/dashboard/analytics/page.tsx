import { MOCK_REVENUE, MOCK_ORDERS } from "@/lib/mockData";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";

const TOP_OCCASIONS = [
  { name: "Diwali", orders: 412, percent: 32, color: "bg-orange-400" },
  { name: "Corporate", orders: 318, percent: 25, color: "bg-blue-400" },
  { name: "New Year", orders: 204, percent: 16, color: "bg-purple-400" },
  { name: "Holi", orders: 152, percent: 12, color: "bg-pink-400" },
  { name: "Others", percent: 15, orders: 198, color: "bg-nutado-gray-300" },
];

const TOP_PRODUCTS = [
  { name: "Assorted Dry Fruits", emoji: "🎁", orders: 284, revenue: 113116 },
  { name: "Kaju Katli Box", emoji: "🍬", orders: 241, revenue: 72059 },
  { name: "Premium Cashew", emoji: "🥜", orders: 198, revenue: 49302 },
  { name: "Dark Choc Box", emoji: "🍫", orders: 176, revenue: 61424 },
];

export default function AnalyticsPage() {
  const totalRevenue = MOCK_REVENUE.reduce((a, b) => a + b.revenue, 0);
  const maxRevenue = Math.max(...MOCK_REVENUE.map((d) => d.revenue));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-nutado-gray-900">Analytics</h1>
        <p className="text-sm text-nutado-gray-500 mt-0.5">Full year performance overview — 2024</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Annual Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: "FY 2024", Icon: TrendingUp, color: "text-green-600 bg-green-50" },
          { label: "Total Orders", value: "1,284", sub: "+12% YoY", Icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
          { label: "Customers", value: "3,421", sub: "+8% YoY", Icon: Users, color: "text-purple-600 bg-purple-50" },
          { label: "Avg Order Value", value: "₹43.8K", sub: "+6% YoY", Icon: Package, color: "text-orange-600 bg-orange-50" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>
              <kpi.Icon size={18} />
            </div>
            <p className="text-2xl font-display font-bold text-nutado-gray-900">{kpi.value}</p>
            <p className="text-xs text-nutado-gray-500 mt-0.5">{kpi.label}</p>
            <p className="text-xs font-semibold text-green-600 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Full year revenue bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
          <div className="mb-5">
            <h3 className="font-display font-semibold text-nutado-gray-900">Monthly Revenue</h3>
            <p className="text-xs text-nutado-gray-500 mt-0.5">Total revenue per month in 2024</p>
          </div>
          <div className="flex items-end gap-1.5 h-48">
            {MOCK_REVENUE.map((d) => {
              const height = Math.round((d.revenue / maxRevenue) * 100);
              const isOct = d.month === "Oct";
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="w-full relative flex justify-center">
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10">
                      <div className="bg-nutado-gray-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap font-semibold">
                        ₹{(d.revenue / 1000).toFixed(0)}K
                      </div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-nutado-gray-900" />
                    </div>
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${isOct ? "bg-nutado-green" : "bg-nutado-green/25 group-hover:bg-nutado-green/50"}`}
                      style={{ height: `${(height / 100) * 12}rem` }}
                    />
                  </div>
                  <span className={`text-[9px] font-medium ${isOct ? "text-nutado-green font-bold" : "text-nutado-gray-400"}`}>{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Occasions breakdown */}
        <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card p-5">
          <h3 className="font-display font-semibold text-nutado-gray-900 mb-5">Orders by Occasion</h3>
          <div className="space-y-3">
            {TOP_OCCASIONS.map((occ) => (
              <div key={occ.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-nutado-gray-700 font-medium">{occ.name}</span>
                  <span className="text-xs font-semibold text-nutado-gray-500">{occ.percent}%</span>
                </div>
                <div className="w-full h-2 bg-nutado-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${occ.color}`}
                    style={{ width: `${occ.percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-nutado-gray-400 mt-0.5">{occ.orders} orders</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-nutado-gray-100">
          <h3 className="font-display font-semibold text-nutado-gray-900">Top Selling Products</h3>
        </div>
        <div className="divide-y divide-nutado-gray-100">
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4 px-5 py-4">
              <span className="text-xs font-bold text-nutado-gray-400 w-5">#{i + 1}</span>
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-nutado-gray-900">{p.name}</p>
                <p className="text-xs text-nutado-gray-400">{p.orders} orders</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-nutado-green">₹{(p.revenue / 1000).toFixed(1)}K</p>
                <p className="text-xs text-nutado-gray-400">revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
