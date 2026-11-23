"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, PlusCircle } from "lucide-react";

export function AddMenuForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const parsedPrice = Number(price);
    if (!name.trim()) {
      setError("Vui lòng nhập tên món.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Vui lòng nhập giá tiền hợp lệ (VNĐ).");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          price: parsedPrice,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        item?: { name: string };
      };

      if (!response.ok) {
        throw new Error(data.error || "Không thể thêm món mới.");
      }

      setSuccessMessage(
        `Đã thêm "${data.item?.name ?? name.trim()}" và làm mới cache trang POS!`
      );
      setName("");
      setPrice("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-soft">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-tea-900">Thêm món mới</h2>
        <p className="mt-1 text-xs text-cream-700">
          Gọi <code className="rounded bg-cream-200 px-1 py-0.5">POST /api/menu</code>{" "}
          kèm <code className="rounded bg-cream-200 px-1 py-0.5">revalidatePath(&apos;/&apos;)</code>{" "}
          để cập nhật thực đơn tức thì.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="menu-name"
            className="mb-1.5 block text-sm font-semibold text-tea-900"
          >
            Tên món
          </label>
          <input
            id="menu-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Trà Xoài Macchiato"
            className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-tea-900 placeholder:text-cream-500 focus:border-tea-600 focus:outline-none focus:ring-2 focus:ring-tea-500/20"
            required
          />
        </div>

        <div>
          <label
            htmlFor="menu-price"
            className="mb-1.5 block text-sm font-semibold text-tea-900"
          >
            Giá tiền (VNĐ)
          </label>
          <input
            id="menu-price"
            type="number"
            min={1000}
            step={1000}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="42000"
            className="w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm text-tea-900 placeholder:text-cream-500 focus:border-tea-600 focus:outline-none focus:ring-2 focus:ring-tea-500/20"
            required
          />
        </div>

        {error && (
          <p className="rounded-xl bg-danger/10 px-3 py-2 text-xs font-medium text-danger">
            {error}
          </p>
        )}

        {successMessage && (
          <div className="rounded-xl border border-tea-300 bg-tea-50 p-3 text-xs text-tea-900">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-tea-600" />
              <div className="space-y-2">
                <p className="font-semibold">{successMessage}</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 font-bold text-tea-700 underline underline-offset-2 hover:text-tea-900"
                >
                  <span>Về trang POS kiểm tra</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-tea-900 px-4 py-3 text-sm font-bold text-cream-50 shadow-soft transition-all hover:bg-tea-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 text-champagne-400" />
              <span>Thêm món</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
