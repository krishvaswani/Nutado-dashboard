"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Package, Users, BarChart2, Settings, ArrowRight, X } from "lucide-react";
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_CUSTOMERS } from "@/lib/mockData";

interface SearchResult {
  id: string;
  type: "order" | "product" | "customer" | "page";
  label: string;
  sub: string;
  href: string;
  emoji?: string;
}

const PAGES: SearchResult[] = [
  { id: "p1", type: "page", label: "Dashboard",  sub: "Overview & stats",          href: "/dashboard",            emoji: "🏠" },
  { id: "p2", type: "page", label: "Orders",     sub: "View all orders",           href: "/dashboard/orders",     emoji: "📦" },
  { id: "p3", type: "page", label: "Products",   sub: "Manage product catalog",    href: "/dashboard/products",   emoji: "🛍️" },
  { id: "p4", type: "page", label: "Customers",  sub: "View customer profiles",    href: "/dashboard/customers",  emoji: "👥" },
  { id: "p5", type: "page", label: "Analytics",  sub: "Revenue & performance",     href: "/dashboard/analytics",  emoji: "📊" },
  { id: "p6", type: "page", label: "Settings",   sub: "Account & preferences",     href: "/dashboard/settings",   emoji: "⚙️" },
  { id: "p7", type: "page", label: "New Order",  sub: "Start gifting onboarding",  href: "/onboarding/step1",     emoji: "✨" },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build results
  const results: SearchResult[] = query.trim()
    ? [
        ...PAGES.filter((p) =>
          p.label.toLowerCase().includes(query.toLowerCase())
        ),
        ...MOCK_ORDERS.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
            o.customer.toLowerCase().includes(query.toLowerCase()) ||
            o.company.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3).map((o) => ({
          id: o.id,
          type: "order" as const,
          label: o.orderNumber,
          sub: `${o.customer} · ${o.company}`,
          href: `/dashboard/orders/${o.id}`,
          emoji: "📦",
        })),
        ...MOCK_PRODUCTS.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3).map((p) => ({
          id: String(p.id),
          type: "product" as const,
          label: p.name,
          sub: `${p.brand} · ₹${p.price}`,
          href: `/dashboard/products/${p.id}`,
          emoji: p.emoji,
        })),
        ...MOCK_CUSTOMERS.filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.company.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3).map((c) => ({
          id: c.id,
          type: "customer" as const,
          label: c.name,
          sub: c.company,
          href: `/dashboard/customers/${c.id}`,
          emoji: "👤",
        })),
      ]
    : PAGES;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown")  { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
      if (e.key === "ArrowUp")    { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && results[selected]) {
        router.push(results[selected].href);
        onClose();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results, selected, router, onClose]);

  if (!isOpen) return null;

  const TYPE_ICONS = {
    order:    <ShoppingBag size={13} className="text-blue-500" />,
    product:  <Package     size={13} className="text-green-500" />,
    customer: <Users       size={13} className="text-purple-500" />,
    page:     <ArrowRight  size={13} className="text-nutado-gray-400" />,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-elevated w-full max-w-lg overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-nutado-gray-100">
          <Search size={18} className="text-nutado-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search orders, products, customers, pages…"
            className="flex-1 text-sm text-nutado-gray-900 placeholder-nutado-gray-400 outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-nutado-gray-400 hover:text-nutado-gray-700">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-nutado-gray-400 border border-nutado-gray-200 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="text-center py-10 text-nutado-gray-400 text-sm">
              No results for "{query}"
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={r.id}
                onClick={() => { router.push(r.href); onClose(); }}
                onMouseEnter={() => setSelected(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  selected === i ? "bg-brand-50" : "hover:bg-nutado-gray-50"
                }`}
              >
                <span className="text-lg w-6 text-center flex-shrink-0">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${selected === i ? "text-nutado-green" : "text-nutado-gray-900"}`}>
                    {r.label}
                  </p>
                  <p className="text-xs text-nutado-gray-400 truncate">{r.sub}</p>
                </div>
                <span className={`flex-shrink-0 ${selected === i ? "opacity-100" : "opacity-0"}`}>
                  {TYPE_ICONS[r.type]}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-nutado-gray-100 flex items-center gap-4 text-[11px] text-nutado-gray-400">
          <span><kbd className="font-medium">↑↓</kbd> Navigate</span>
          <span><kbd className="font-medium">↵</kbd> Open</span>
          <span><kbd className="font-medium">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
