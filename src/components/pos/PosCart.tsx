"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import type { IceLevel, SugarLevel } from "@/lib/types";
import { formatVND } from "@/lib/data";
import { useCart } from "./CartContext";

const ICE_OPTIONS: IceLevel[] = ["100%", "50%", "Ít đá"];
const SUGAR_OPTIONS: SugarLevel[] = ["100%", "70%", "50%"];

export function PosCart() {
  const router = useRouter();
  const {
    items,
    totalItems,
    totalAmount,
    updateQuantity,
    removeItem,
    updateIce,
    updateSugar,
    clearCart,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ menuItemId, name, price, quantity, ice, sugar }) => ({
            menuItemId,
            name,
            price,
            quantity,
            ice,
            sugar,
          })),
          totalAmount,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error || "Thanh toán thất bại.");
      }

      const order = (await response.json()) as { id: string };
      clearCart();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      setIsSubmitting(false);
    }
  }

  return (
    <aside className="flex h-fit flex-col rounded-2xl border border-cream-300 bg-cream-50 p-5 shadow-soft lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-cream-200 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-tea-100 text-tea-900">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-tea-900">Giỏ hàng POS</h2>
            <p className="text-xs text-cream-700">{totalItems} ly đã chọn</p>
          </div>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="cursor-pointer text-xs font-medium text-danger hover:underline"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cream-200/70 text-tea-600">
            <ReceiptText className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold text-tea-900">
            Chưa có món nào trong đơn
          </p>
          <p className="mt-1 text-xs text-cream-700">
            Chọn thức uống bên trái để bắt đầu lên đơn.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex max-h-[52vh] flex-col gap-3 overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-cream-200 bg-white p-3.5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-tea-900">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-tea-600">
                    {formatVND(item.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  aria-label={`Xóa ${item.name}`}
                  className="cursor-pointer rounded-lg p-1 text-cream-600 transition-colors hover:bg-cream-100 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-cream-700">
                    Đá
                  </span>
                  <div className="flex gap-1">
                    {ICE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateIce(item.key, option)}
                        className={`cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium transition-colors ${
                          item.ice === option
                            ? "bg-tea-900 text-cream-50"
                            : "bg-cream-100 text-tea-900 hover:bg-cream-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-cream-700">
                    Đường
                  </span>
                  <div className="flex gap-1">
                    {SUGAR_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateSugar(item.key, option)}
                        className={`cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium transition-colors ${
                          item.sugar === option
                            ? "bg-champagne-500 text-tea-950"
                            : "bg-cream-100 text-tea-900 hover:bg-cream-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-cream-100 pt-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, -1)}
                    aria-label="Giảm số lượng"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-cream-300 bg-cream-50 text-tea-900 transition-colors hover:bg-cream-200"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-bold text-tea-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.key, 1)}
                    aria-label="Tăng số lượng"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-cream-300 bg-cream-50 text-tea-900 transition-colors hover:bg-cream-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-sm font-bold text-tea-900">
                  {formatVND(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-xl bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
          {error}
        </p>
      )}

      <div className="mt-5 border-t border-cream-200 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-cream-700">
            Tổng thanh toán
          </span>
          <span className="text-xl font-extrabold text-tea-900">
            {formatVND(totalAmount)}
          </span>
        </div>

        <button
          type="button"
          disabled={items.length === 0 || isSubmitting}
          onClick={handleCheckout}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-tea-900 px-4 py-3.5 text-sm font-bold text-cream-50 shadow-elevated transition-all hover:bg-tea-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang tạo hóa đơn...</span>
            </>
          ) : (
            <>
              <ReceiptText className="h-4 w-4 text-champagne-400" />
              <span>Thanh toán</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
