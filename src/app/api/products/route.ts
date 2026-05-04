import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search   = searchParams.get("search")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "all";
  const page     = Number(searchParams.get("page") ?? 1);
  const limit    = Number(searchParams.get("limit") ?? 20);

  let products = MOCK_PRODUCTS;

  if (search) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search)
    );
  }

  if (category !== "all") {
    products = products.filter((p) => p.category === category);
  }

  const total = products.length;
  const data  = products.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // TODO: validate + persist
    const newProduct = { id: Date.now(), inStock: true, ...body };
    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
