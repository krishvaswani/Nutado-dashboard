"use client";

import { MOCK_REVENUE } from "@/lib/mockData";

export default function RevenueChart() {
  const max = Math.max(...MOCK_REVENUE.map((d) => d.revenue));

  return (
    <div className="bg-white rounded-xl border border-nutado-gray-200 p-5 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-nutado-gray-900">
            Revenue Overview
          </h3>
          <p className="text-xs text-nutado-gray-500 mt-0.5">
            Monthly revenue for 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-nutado-green inline-block" />
            <span className="text-xs text-nutado-gray-500">Revenue</span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5 h-40">
        {MOCK_REVENUE.map((d) => {
          const height = Math.round((d.revenue / max) * 100);
          const isOct = d.month === "Oct";
          return (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              <div className="relative w-full flex justify-center">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10">
                  <div className="bg-nutado-gray-900 text-white text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap">
                    ₹{(d.revenue / 1000).toFixed(0)}K
                    <br />
                    <span className="font-normal opacity-70">
                      {d.orders} orders
                    </span>
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-nutado-gray-900" />
                </div>

                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    isOct
                      ? "bg-nutado-green"
                      : "bg-nutado-green/30 group-hover:bg-nutado-green/60"
                  }`}
                  style={{ height: `${height * 0.01 * 10}rem` }}
                />
              </div>
              <span
                className={`text-[9px] font-medium ${
                  isOct ? "text-nutado-green" : "text-nutado-gray-400"
                }`}
              >
                {d.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
