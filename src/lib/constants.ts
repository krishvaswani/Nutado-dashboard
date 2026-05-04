// ─── App ───────────────────────────────────────────────────────────
export const APP_NAME    = "Nutado";
export const APP_TAGLINE = "Every Home Deserves Better Snacking";
export const APP_URL     = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Navigation ────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { href: "/dashboard",            label: "Dashboard",  icon: "LayoutDashboard" },
  { href: "/dashboard/orders",     label: "Orders",     icon: "ShoppingBag"     },
  { href: "/dashboard/products",   label: "Products",   icon: "Package"         },
  { href: "/dashboard/customers",  label: "Customers",  icon: "Users"           },
  { href: "/dashboard/analytics",  label: "Analytics",  icon: "BarChart2"       },
  { href: "/dashboard/settings",   label: "Settings",   icon: "Settings"        },
] as const;

// ─── Pagination ────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;

// ─── Occasions ─────────────────────────────────────────────────────
export const OCCASIONS = [
  { id: "diwali",      label: "Diwali",           emoji: "🪔" },
  { id: "holi",        label: "Holi",             emoji: "🎨" },
  { id: "eid",         label: "Eid",              emoji: "🌙" },
  { id: "christmas",   label: "Christmas",        emoji: "🎄" },
  { id: "birthday",    label: "Birthday",         emoji: "🎂" },
  { id: "wedding",     label: "Wedding",          emoji: "💍" },
  { id: "corporate",   label: "Corporate",        emoji: "🏢" },
  { id: "new-year",    label: "New Year",         emoji: "🎆" },
  { id: "anniversary", label: "Anniversary",      emoji: "🌹" },
  { id: "raksha",      label: "Raksha Bandhan",   emoji: "🧡" },
  { id: "navratri",    label: "Navratri",         emoji: "🕺" },
  { id: "custom",      label: "Custom",           emoji: "✨" },
] as const;

// ─── Bundle sizes ──────────────────────────────────────────────────
export const BUNDLE_SIZES = [
  { id: "small",      label: "Small",      range: "10–25",   price: 499 },
  { id: "medium",     label: "Medium",     range: "26–100",  price: 449 },
  { id: "large",      label: "Large",      range: "101–500", price: 399 },
  { id: "enterprise", label: "Enterprise", range: "500+",    price: 349 },
] as const;

// ─── Order statuses ────────────────────────────────────────────────
export const ORDER_STATUSES = [
  "pending", "processing", "shipped", "delivered", "cancelled",
] as const;

// ─── GST rate ──────────────────────────────────────────────────────
export const GST_RATE = 0.18;

// ─── Brand colours ─────────────────────────────────────────────────
export const BRAND = {
  green:      "#0a6e3a",
  greenDark:  "#064d28",
  greenLight: "#0f8c4a",
} as const;
