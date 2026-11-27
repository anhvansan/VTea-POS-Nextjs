import { NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/data";
import type { OrderItem } from "@/lib/types";

export async function GET() {
  const orders = getOrders();
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return NextResponse.json({
    orders,
    totalOrders: orders.length,
    totalRevenue,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items?: unknown;
      totalAmount?: unknown;
    };

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Giỏ hàng trống, không thể tạo đơn hàng." },
        { status: 400 }
      );
    }

    const items = body.items as OrderItem[];
    const computedTotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const totalAmount =
      typeof body.totalAmount === "number" && body.totalAmount > 0
        ? body.totalAmount
        : computedTotal;

    const order = createOrder({ items, totalAmount });
    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Không thể tạo đơn hàng." },
      { status: 400 }
    );
  }
}
