"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart2,
  Settings,
  PlusCircle,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-nutado-gray-200 z-30 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-nutado-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-nutado-green rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-display font-bold text-sm">N</span>
            </div>
            <span className="font-display font-bold text-lg text-nutado-gray-900 tracking-tight">
              Nutado
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-nutado-gray-400 hover:text-nutado-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Order CTA */}
        <div className="px-4 py-3 border-b border-nutado-gray-100">
          <Link
            href="/onboarding/step1"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-nutado-green text-white text-sm font-semibold rounded-lg hover:bg-nutado-green-dark transition-colors"
            onClick={onClose}
          >
            <PlusCircle size={16} />
            New Order
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${
                    isActive
                      ? "bg-brand-50 text-nutado-green"
                      : "text-nutado-gray-600 hover:bg-nutado-gray-50 hover:text-nutado-gray-900"
                  }
                `}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-nutado-green" : "text-nutado-gray-400"}
                />
                {label}
                {label === "Orders" && (
                  <span className="ml-auto text-[10px] font-bold bg-nutado-green text-white px-1.5 py-0.5 rounded-full">
                    8
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="px-4 py-4 border-t border-nutado-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-nutado-green text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              JD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-nutado-gray-900 truncate">
                John Doe
              </p>
              <p className="text-xs text-nutado-gray-400 truncate">
                john@acme.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
