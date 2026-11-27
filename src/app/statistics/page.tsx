import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  ReceiptText,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatVND, getOrders } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function StatisticsPage() {
  const orders = getOrders();
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const renderedAt = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Header & SSR Badge */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tea-900 px-3 py-1 text-xs font-bold text-champagne-300 shadow-soft">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>SSR (force-dynamic)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 bg-cream-50 px-3 py-1 text-xs font-semibold text-tea-800">
              <Clock className="h-3.5 w-3.5 text-tea-600" />
              <span>Server rendered at: {renderedAt}</span>
            </span>
          </div>
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-tea-900 sm:text-3xl">
            Thống kê & Hóa đơn
          </h1>
          <p className="mt-1 text-sm text-cream-700">
            Dữ liệu được render trực tiếp từ server trên mỗi lần tải trang (bấm
            F5 để thấy giờ server cập nhật).
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-tea-900 shadow-soft transition-colors hover:bg-cream-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang POS</span>
        </Link>
      </div>

      {/* 3 Thẻ KPI */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cream-700">
              Tổng doanh thu
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tea-100 text-tea-800">
              <Wallet className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-tea-900 sm:text-3xl">
            {formatVND(totalRevenue)}
          </p>
          <p className="mt-1 text-xs text-cream-700">
            Tổng tiền từ tất cả hóa đơn đã thanh toán
          </p>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cream-700">
              Tổng số đơn hàng
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-champagne-100 text-champagne-800">
              <ShoppingBag className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-tea-900 sm:text-3xl">
            {totalOrders} đơn
          </p>
          <p className="mt-1 text-xs text-cream-700">
            Cập nhật tức thì khi có đơn mới từ POS
          </p>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cream-700">
              Giá trị trung bình / đơn
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tea-900 text-champagne-300">
              <TrendingUp className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-tea-900 sm:text-3xl">
            {formatVND(averageOrderValue)}
          </p>
          <p className="mt-1 text-xs text-cream-700">
            Doanh thu bình quân trên mỗi hóa đơn
          </p>
        </div>
      </section>

      {/* Bảng danh sách hóa đơn */}
      <section className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-soft">
        <div className="flex items-center justify-between border-b border-cream-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ReceiptText className="h-5 w-5 text-tea-700" />
            <div>
              <h2 className="text-base font-bold text-tea-900">
                Danh sách hóa đơn gần nhất
              </h2>
              <p className="text-xs text-cream-700">
                Bấm vào mã đơn để xem chi tiết hóa đơn (Dynamic Route)
              </p>
            </div>
          </div>
          <span className="rounded-full bg-tea-100 px-3 py-1 text-xs font-bold text-tea-800">
            {totalOrders} hóa đơn
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 bg-cream-100/80 text-xs font-bold uppercase tracking-wider text-cream-700">
                <th className="px-6 py-3.5">Mã đơn</th>
                <th className="px-6 py-3.5">Số lượng món</th>
                <th className="px-6 py-3.5 text-right">Tổng tiền</th>
                <th className="px-6 py-3.5 text-right">Thời gian tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {orders.map((order) => {
                const totalCups = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
                const formattedTime = new Intl.DateTimeFormat("vi-VN", {
                  dateStyle: "short",
                  timeStyle: "medium",
                }).format(new Date(order.createdAt));

                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-cream-100/70"
                  >
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-tea-100/80 px-2.5 py-1 font-bold text-tea-900 transition-colors hover:bg-tea-900 hover:text-champagne-300"
                      >
                        #{order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-tea-900">
                        {totalCups} ly
                      </span>
                      <span className="ml-2 text-xs text-cream-700">
                        ({order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")})
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-extrabold text-tea-800">
                      {formatVND(order.totalAmount)}
                    </td>
                    <td className="px-6 py-3.5 text-right text-xs font-medium text-cream-700">
                      {formattedTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
