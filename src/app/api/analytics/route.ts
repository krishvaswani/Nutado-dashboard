import { NextResponse } from "next/server";
import { MOCK_ORDERS, MOCK_REVENUE, MOCK_CUSTOMERS } from "@/lib/mockData";

export async function GET() {
  const totalRevenue  = MOCK_REVENUE.reduce((s, d) => s + d.revenue, 0);
  const totalOrders   = MOCK_ORDERS.length;
  const totalCustomers = MOCK_CUSTOMERS.length;
  const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  const byStatus = MOCK_ORDERS.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const byOccasion = MOCK_ORDERS.reduce<Record<string, number>>((acc, o) => {
    acc[o.occasion] = (acc[o.occasion] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    data: {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue,
      monthlyRevenue: MOCK_REVENUE,
      byStatus,
      byOccasion,
    },
  });
}
