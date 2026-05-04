import { getStatusColor } from "@/lib/utils";
import type { OrderStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus;
}

const LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, text, dot } = getStatusColor(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {LABELS[status]}
    </span>
  );
}
