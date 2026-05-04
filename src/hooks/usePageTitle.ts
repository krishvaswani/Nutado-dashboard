"use client";

import { usePathname } from "next/navigation";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard":            "Dashboard",
  "/dashboard/orders":     "Orders",
  "/dashboard/products":   "Products",
  "/dashboard/customers":  "Customers",
  "/dashboard/analytics":  "Analytics",
  "/dashboard/settings":   "Settings",
};

export function usePageTitle(): string {
  const pathname = usePathname();

  // Exact match
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];

  // Dynamic segments  e.g. /dashboard/orders/1
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 3) {
    const parent = `/${segments[0]}/${segments[1]}`;
    const parentTitle = ROUTE_TITLES[parent];
    if (parentTitle) return parentTitle;
  }

  return "Nutado";
}
