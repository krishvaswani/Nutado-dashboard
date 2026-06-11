import type { OrderStatus } from "@/types";

export function formatCurrency(amount?: number | null): string {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString("en-IN")}`;
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getStatusColor(status?: OrderStatus | null): {
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
  const key = status || "pending";
  return map[key] || map.pending;
}

export function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
