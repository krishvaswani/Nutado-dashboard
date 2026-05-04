import { NextRequest, NextResponse } from "next/server";
import { MOCK_CUSTOMERS } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const status = searchParams.get("status") ?? "all";

  let customers = MOCK_CUSTOMERS;

  if (search) {
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.company.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
    );
  }

  if (status !== "all") {
    customers = customers.filter((c) => c.status === status);
  }

  return NextResponse.json({ data: customers, meta: { total: customers.length } });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCustomer = {
      id: `c${Date.now()}`,
      totalOrders: 0,
      totalSpend: 0,
      lastOrder: new Date().toISOString().split("T")[0],
      status: "active" as const,
      avatar: ((body.name as string) ?? "??")
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      ...body,
    };
    return NextResponse.json({ data: newCustomer }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
