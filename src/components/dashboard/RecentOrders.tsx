import Link from "next/link";
import { MOCK_ORDERS } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { ArrowRight } from "lucide-react";

export default function RecentOrders() {
  const recent = MOCK_ORDERS.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-nutado-gray-200 shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-nutado-gray-100">
        <h3 className="font-display font-semibold text-nutado-gray-900">
          Recent Orders
        </h3>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-1 text-xs font-semibold text-nutado-green hover:text-nutado-green-dark transition-colors"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-nutado-gray-50">
              <th className="text-left text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3">
                Order
              </th>
              <th className="text-left text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3">
                Customer
              </th>
              <th className="text-left text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">
                Occasion
              </th>
              <th className="text-left text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">
                Delivery
              </th>
              <th className="text-right text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3">
                Total
              </th>
              <th className="text-left text-[11px] font-semibold text-nutado-gray-500 uppercase tracking-wide px-5 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nutado-gray-100">
            {recent.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-nutado-gray-50 transition-colors duration-100"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="text-sm font-semibold text-nutado-green hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-nutado-gray-400 mt-0.5">
                    {order.quantity} boxes
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-nutado-gray-900">
                    {order.customer}
                  </p>
                  <p className="text-xs text-nutado-gray-400 mt-0.5">
                    {order.company}
                  </p>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="inline-block px-2.5 py-1 bg-nutado-gray-100 text-nutado-gray-600 text-xs font-medium rounded-full">
                    {order.occasion}
                  </span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-sm text-nutado-gray-600">
                    {formatDate(order.deliveryDate)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-sm font-semibold text-nutado-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
