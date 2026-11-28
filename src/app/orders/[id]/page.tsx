import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, ReceiptText } from "lucide-react";
import { formatVND, getOrderById } from "@/lib/data";
import { decodeOrderCookie, LAST_ORDER_COOKIE } from "@/lib/orderCookie";

export const dynamic = "force-dynamic";

interface OrderReceiptPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderReceiptPage({
  params,
}: OrderReceiptPageProps) {
  const { id } = await params;
  let order = getOrderById(id);

  if (!order) {
    const cookieStore = await cookies();
    const fallbackOrder = decodeOrderCookie(
      cookieStore.get(LAST_ORDER_COOKIE)?.value
    );
    if (fallbackOrder?.id === id) {
      order = fallbackOrder;
    }
  }

  if (!order) {
    notFound();
  }

  const formattedTime = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(order.createdAt));

  return (
    <div className="mx-auto max-w-2xl py-4">
      <div className="overflow-hidden rounded-3xl border border-cream-300 bg-cream-50 shadow-elevated">
        <div className="bg-tea-900 px-6 py-7 text-center text-cream-50">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-champagne-500 text-tea-950 shadow-gold">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-champagne-300">
            Thanh toán thành công
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">
            Hóa đơn #{order.id}
          </h1>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-tea-200">
            <Clock className="h-3.5 w-3.5" />
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-tea-900">
            <ReceiptText className="h-4 w-4 text-tea-600" />
            <span>Chi tiết đơn hàng</span>
          </div>

          <div className="divide-y divide-dashed divide-cream-300 border-y border-dashed border-cream-300">
            {order.items.map((item, index) => (
              <div
                key={`${item.menuItemId}-${index}`}
                className="flex items-start justify-between gap-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-bold text-tea-900">
                    {item.name}{" "}
                    <span className="font-semibold text-tea-600">
                      × {item.quantity}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-cream-700">
                    Đá: {item.ice} · Đường: {item.sugar}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-tea-900">
                  {formatVND(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-tea-50 px-5 py-4">
            <span className="text-sm font-semibold text-tea-800">
              Tổng tiền thanh toán
            </span>
            <span className="text-2xl font-extrabold text-tea-900">
              {formatVND(order.totalAmount)}
            </span>
          </div>

          <div className="mt-7 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-tea-900 px-6 py-3 text-sm font-bold text-cream-50 shadow-soft transition-colors hover:bg-tea-800"
            >
              <ArrowLeft className="h-4 w-4 text-champagne-400" />
              <span>Quay lại bán hàng</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
