import React from "react";
import { Gift, Package, Sparkles, Heart, Flame, ShieldAlert, ShoppingBag } from "lucide-react";

interface ProductIconProps {
  category?: string;
  name?: string;
  size?: number;
  className?: string;
}

export default function ProductIcon({ category = "", name = "", size = 24, className = "" }: ProductIconProps) {
  const normCat = category.toLowerCase();
  const normName = name.toLowerCase();

  // Select suitable Lucide Icon and background theme styling based on category
  let Icon = Package;
  let bgClass = "bg-red-50 border-red-100 text-[#ec2626]";

  if (normCat.includes("sweet") || normName.includes("katli")) {
    Icon = Sparkles;
    bgClass = "bg-amber-50 border-amber-100 text-amber-600";
  } else if (normCat.includes("nut") || normName.includes("cashew") || normName.includes("almond")) {
    Icon = Sparkles;
    bgClass = "bg-orange-50 border-orange-100 text-orange-600";
  } else if (normCat.includes("chocolate") || normName.includes("choc")) {
    Icon = Heart;
    bgClass = "bg-rose-50 border-rose-100 text-rose-600";
  } else if (normCat.includes("dry-fruits") || normName.includes("fruit") || normName.includes("dates")) {
    Icon = Gift;
    bgClass = "bg-pink-50 border-pink-100 text-pink-600";
  } else if (normCat.includes("chips") || normName.includes("namkeen") || normName.includes("snack")) {
    Icon = Flame;
    bgClass = "bg-blue-50 border-blue-100 text-blue-600";
  } else if (normCat.includes("box") || normName.includes("box") || normName.includes("bundle")) {
    Icon = Gift;
    bgClass = "bg-purple-50 border-purple-100 text-purple-600";
  }

  return (
    <div className={`flex items-center justify-center rounded-xl border shrink-0 select-none shadow-sm ${bgClass} ${className}`}>
      <Icon size={size} className="stroke-[2]" />
    </div>
  );
}
