"use client";

import { Menu, Bell, Search, Command } from "lucide-react";
import { useState } from "react";

interface TopbarProps {
  onMenuClick: () => void;
  onSearchClick?: () => void;
  title?: string;
}

const NOTIFICATIONS = [
  { id: 1, text: "New order NTD-2024-08471 received",      time: "2m ago",  unread: true  },
  { id: 2, text: "Order NTD-2024-08392 has been shipped",  time: "1h ago",  unread: true  },
  { id: 3, text: "Order NTD-2024-08301 delivered",         time: "3h ago",  unread: false },
];

export default function Topbar({ onMenuClick, onSearchClick, title }: TopbarProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="h-14 bg-white border-b border-nutado-gray-200 flex items-center gap-3 px-4 sticky top-0 z-10">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="lg:hidden text-nutado-gray-500 hover:text-nutado-gray-900 transition-colors">
        <Menu size={22} />
      </button>

      {/* Page title */}
      {title && (
        <h1 className="font-display font-semibold text-nutado-gray-900 hidden sm:block">{title}</h1>
      )}

      {/* Search trigger — opens CommandPalette */}
      <button
        onClick={onSearchClick}
        className="flex-1 max-w-sm hidden md:flex items-center gap-2 px-3 py-2 bg-nutado-gray-50 border border-nutado-gray-200 rounded-lg text-sm text-nutado-gray-400 hover:border-nutado-green hover:bg-white transition-colors group"
      >
        <Search size={15} className="flex-shrink-0" />
        <span className="flex-1 text-left">Search orders, products…</span>
        <span className="flex items-center gap-0.5 text-[11px] font-medium text-nutado-gray-300 group-hover:text-nutado-green transition-colors">
          <Command size={11} />K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        {/* Mobile search button */}
        <button onClick={onSearchClick} className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-nutado-gray-500 hover:bg-nutado-gray-100 transition-colors">
          <Search size={18} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-nutado-gray-500 hover:bg-nutado-gray-100 hover:text-nutado-gray-900 transition-colors relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifs && (
            <>
              {/* Click-away overlay */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-nutado-gray-200 shadow-elevated z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-nutado-gray-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-nutado-gray-900">Notifications</span>
                  <span className="text-xs font-semibold text-nutado-green bg-brand-50 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                </div>
                <div className="divide-y divide-nutado-gray-100">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 flex items-start gap-3 hover:bg-nutado-gray-50 transition-colors cursor-pointer ${n.unread ? "bg-brand-50/40" : ""}`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-nutado-green" : "bg-nutado-gray-300"}`} />
                      <div className="min-w-0">
                        <p className="text-sm text-nutado-gray-800">{n.text}</p>
                        <p className="text-xs text-nutado-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-nutado-gray-100 text-center">
                  <button className="text-xs font-semibold text-nutado-green hover:text-nutado-green-dark transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-nutado-green text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity">
          JD
        </div>
      </div>
    </header>
  );
}
