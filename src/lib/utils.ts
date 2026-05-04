import type { OrderStatus } from "@/types";

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getStatusColor(status: OrderStatus): {
  bg: string;
  text: string;
  dot: string;
} {
  const map: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-400",
    },
    processing: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-400",
    },
    shipped: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      dot: "bg-purple-400",
    },
    delivered: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    cancelled: {
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-400",
    },
  };
  return map[status];
}

export function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
