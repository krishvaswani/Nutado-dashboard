import { NextRequest, NextResponse } from "next/server";
import { MOCK_ORDERS } from "@/lib/mockData";

// GET /api/orders/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = MOCK_ORDERS.find((o) => o.id === params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ data: order });
}

// PATCH /api/orders/[id] — update status etc.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body  = await req.json();
    const order = MOCK_ORDERS.find((o) => o.id === params.id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    // TODO: persist update to DB
    const updated = { ...order, ...body };
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// DELETE /api/orders/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const order = MOCK_ORDERS.find((o) => o.id === params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  // TODO: soft-delete in DB
  return NextResponse.json({ message: "Order cancelled", id: params.id });
}
