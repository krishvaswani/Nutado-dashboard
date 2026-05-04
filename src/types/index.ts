// ─── User & Auth ────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  role: "admin" | "manager" | "viewer";
  createdAt: string;
}

// ─── Products ───────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  weight: string;
  shelfLife: string;
  minOrder: number;
  rating: number;
  reviews: number;
  emoji: string;
  badge?: string;
  inStock: boolean;
  tags: string[];
}

export type ProductCategory =
  | "nuts"
  | "chocolates"
  | "dry-fruits"
  | "cookies"
  | "sweets"
  | "chips"
  | "healthy"
  | "tea";

// ─── Orders ─────────────────────────────────────────────────────────
export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  company: string;
  occasion: string;
  items: number;
  quantity: number;
  total: number;
  status: OrderStatus;
  deliveryDate: string;
  createdAt: string;
  address: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// ─── Customers ──────────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  lastOrder: string;
  status: "active" | "inactive";
  avatar: string;
}

// ─── Analytics ──────────────────────────────────────────────────────
export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: string;
}

// ─── Onboarding ─────────────────────────────────────────────────────
export interface OnboardingState {
  occasions: string[];
  categories: string[];
  products: number[];
  bundleSize: string;
  quantity: number;
  brandName: string;
  tagline: string;
  primaryColor: string;
  logoUrl?: string;
  boxType?: "signature" | "custom";
  signatureBoxId?: number;
}
