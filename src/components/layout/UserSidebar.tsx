"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import logoImage from "@/Assets/consueltudo-logo---.png";

const NAV_ITEMS = [
  { href: "/user-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user-dashboard/orders", label: "My Orders", icon: ShoppingBag },
];

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <>
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
        <div className="px-5 py-4 border-b border-nutado-gray-100">
          <Link href="/user-dashboard" className="flex items-center gap-2.5">
            <Image src={logoImage} alt="Consuetudo" height={45} className="object-contain w-auto" />
            <div>
              <p className="text-[11px] text-nutado-gray-400">Client workspace</p>
            </div>
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-nutado-gray-100">
          <Link
            href="/onboarding/step1"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-nutado-green text-white text-sm font-semibold rounded-lg hover:bg-nutado-green-dark transition-colors"
            onClick={onClose}
          >
            <PlusCircle size={16} />
            Place Order
          </Link>
        </div>

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
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-nutado-gray-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-nutado-green text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {profile?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-nutado-gray-900 truncate">
                {profile?.name ?? "Client User"}
              </p>
              <p className="text-xs text-nutado-gray-400 truncate">
                {profile?.email ?? ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-nutado-gray-600 bg-nutado-gray-50 rounded-lg hover:bg-nutado-gray-100 transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
