import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({
  label,
  value,
  change,
  changeType,
  Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-nutado-gray-200 p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={20} className={iconColor} />
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            changeType === "up"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {changeType === "up" ? (
            <TrendingUp size={11} />
          ) : (
            <TrendingDown size={11} />
          )}
          {change}
        </span>
      </div>
      <p className="text-2xl font-display font-bold text-nutado-gray-900 mb-0.5">
        {value}
      </p>
      <p className="text-sm text-nutado-gray-500">{label}</p>
    </div>
  );
}
