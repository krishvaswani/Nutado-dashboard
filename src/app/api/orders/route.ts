import { NextRequest, NextResponse } from "next/server";
import { MOCK_ORDERS } from "@/lib/mockData";

// GET /api/orders — list with optional search & status filter
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const status = searchParams.get("status") ?? "all";
  const page   = Number(searchParams.get("page") ?? 1);
  const limit  = Number(searchParams.get("limit") ?? 20);

  let orders = MOCK_ORDERS;

  if (search) {
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(search) ||
        o.customer.toLowerCase().includes(search) ||
        o.company.toLowerCase().includes(search)
    );
  }

  if (status !== "all") {
    orders = orders.filter((o) => o.status === status);
  }

  const total = orders.length;
  const data  = orders.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

// POST /api/orders — create new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // TODO: Validate with Zod, persist to DB
    const newOrder = {
      id: String(Date.now()),
      orderNumber: `NTD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: "pending" as const,
      ...body,
    };

    return NextResponse.json({ data: newOrder }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
