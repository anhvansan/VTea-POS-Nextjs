import Image from "next/image";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { formatVND, getMenuItems } from "@/lib/data";
import { CartProvider } from "@/components/pos/CartContext";
import { AddToCartButton } from "@/components/pos/AddToCartButton";
import { PosCart } from "@/components/pos/PosCart";

export default function PosPage() {
  const menuItems = getMenuItems();

  return (
    <CartProvider>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Cột trái: Danh sách món render ở Server Component */}
        <section className="lg:col-span-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-tea-100 px-3 py-1 text-xs font-semibold text-tea-800">
                <Sparkles className="h-3.5 w-3.5 text-tea-600" />
                <span>Thực đơn hôm nay</span>
              </div>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-tea-900 sm:text-3xl">
                Chọn thức uống VTea
              </h1>
            </div>
            <p className="text-sm font-medium text-cream-700">
              Hiển thị <strong className="text-tea-900">{menuItems.length}</strong>{" "}
              món đang phục vụ
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-cream-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      unoptimized={item.image.startsWith("data:")}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 stroke-[1.5] text-cream-500" />
                  )}
                  {item.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-tea-900/90 px-2.5 py-1 text-[11px] font-semibold text-champagne-300 backdrop-blur-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-tea-600">
                      {item.category}
                    </p>
                    <h2 className="mt-1 text-base font-bold text-tea-900">
                      {item.name}
                    </h2>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-cream-200 pt-3">
                    <span className="text-base font-extrabold text-tea-900">
                      {formatVND(item.price)}
                    </span>
                    <AddToCartButton item={item} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Cột phải: Giỏ hàng tương tác ('use client') */}
        <div className="lg:col-span-4">
          <PosCart />
        </div>
      </div>
    </CartProvider>
  );
}
