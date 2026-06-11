// ─── User & Auth ────────────────────────────────────────────────────
export type AppRole = "client" | "employee" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
  role: "admin" | "manager" | "viewer";
  createdAt: string;
}

export interface AuthProfile {
  uid: string;
  email: string;
  name: string;
  company: string;
  phone?: string;
  role: AppRole;
  createdAt: string;
  password?: string;
}

// ─── Products ───────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: ProductCategory | string;
  price: number;
  originalPrice: number;
  weight: string;
  shelfLife: string;
  minOrder: number;
  rating: number;
  reviews: number;
  emoji?: string;
  imageUrl?: string;
  length?: number;
  width?: number;
  height?: number;
  volume?: number;
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

export interface OrderProduct {
  id: number;
  name: string;
  brand?: string;
  quantity?: number;
  price?: number;
}

export interface FollowUp {
  date: string;
  remarks: string;
  callerName: string;
  createdAt: string;
}

export interface OrderRecord extends Order {
  occasionLabel?: string;
  companyId?: string;
  customerId?: string;
  createdByUid?: string;
  createdByRole?: AppRole;
  boxType?: "signature" | "custom";
  signatureBoxId?: number | string;
  products?: OrderProduct[];
  industry?: string;
  message?: string;
  messageTemplate?: string;
  logoChoice?: string;
  ribbonTheme?: string;
  invoiceUrl?: string;
  followUps?: FollowUp[];
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
  companyName: string;
  industry: string;
  contactPerson: string;
  clientEmail: string;
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
  signatureBoxId?: number | string;
  message?: string;
  messageTemplate?: string;
  logoChoice?: string;
  ribbonTheme?: string;
  orderReference?: string;
}

export interface SignatureBoxRecord {
  id: string;
  label: string;
  imageUrl: string;
  imageUrls?: string[];
  productIds: number[];
  optionalProductIds?: number[];
  createdAt: string;
  boxType?: "predefined" | "custom";
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  maxPrice?: number;
}
