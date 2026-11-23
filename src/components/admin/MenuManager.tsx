"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Pencil,
  PlusCircle,
  Save,
  X,
} from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatVND } from "@/lib/data";

const PRESET_IMAGES = [
  { label: "Xoài Macchiato", src: "/images/tra-xoai-macchiato.jpg" },
  { label: "Trà Ô Long", src: "/images/tra-o-long.jpg" },
  { label: "Trà Nhài Sữa", src: "/images/tra-nhai-sua.jpg" },
  { label: "Trân Châu Đường Đen", src: "/images/tra-sua-tran-chau.jpg" },
  { label: "Matcha Kem Cheese", src: "/images/matcha-kem-cheese.jpg" },
  { label: "Trà Đào Cam Sả", src: "/images/tra-dao-cam-sa.jpg" },
  { label: "Hồng Trà Kem Muối", src: "/images/hong-tra-kem-muoi.jpg" },
];

interface MenuManagerProps {
  items: MenuItem[];
}

export function MenuManager({ items }: MenuManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("/images/tra-xoai-macchiato.jpg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEditing = editingId !== null;

  function handleSelectItem(item: MenuItem) {
    setEditingId(item.id);
    setName(item.name);
    setPrice(String(item.price));
    setImage(item.image);
    setError(null);
    setSuccessMessage(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setPrice("");
    setImage("/images/tra-xoai-macchiato.jpg");
    setError(null);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WebP...).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ảnh tối đa 2MB để đảm bảo tốc độ tải nhanh.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  }

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
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing
            ? {
                id: editingId,
                name: name.trim(),
                price: parsedPrice,
                image,
              }
            : {
                name: name.trim(),
                price: parsedPrice,
                image,
              }
        ),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        item?: { name: string };
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEditing ? "Không thể cập nhật món." : "Không thể thêm món mới.")
        );
      }

      setSuccessMessage(
        isEditing
          ? `Đã cập nhật "${data.item?.name ?? name.trim()}" và làm mới cache trang POS!`
          : `Đã thêm "${data.item?.name ?? name.trim()}" và làm mới cache trang POS!`
      );

      setEditingId(null);
      setName("");
      setPrice("");
      setImage("/images/tra-xoai-macchiato.jpg");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Cột trái: Form Thêm / Sửa món */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 shadow-soft">
          <div className="mb-5 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-tea-900">
                {isEditing ? "Chỉnh sửa món" : "Thêm món mới"}
              </h2>
              <p className="mt-1 text-xs text-cream-700">
                Gọi{" "}
                <code className="rounded bg-cream-200 px-1 py-0.5">
                  {isEditing ? "PUT /api/menu" : "POST /api/menu"}
                </code>{" "}
                kèm{" "}
                <code className="rounded bg-cream-200 px-1 py-0.5">
                  revalidatePath(&apos;/&apos;)
                </code>
                .
              </p>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-cream-300 bg-white px-2.5 py-1 text-xs font-semibold text-tea-900 hover:bg-cream-100"
              >
                <X className="h-3.5 w-3.5" />
                <span>Hủy</span>
              </button>
            )}
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

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-tea-900">
                Ảnh món
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-cream-300 bg-white p-2.5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-cream-200 bg-cream-100">
                  <Image
                    src={image}
                    alt={name || "Ảnh xem trước"}
                    fill
                    sizes="56px"
                    unoptimized={image.startsWith("data:")}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-tea-100 px-3 py-1.5 text-xs font-semibold text-tea-900 transition-colors hover:bg-tea-200">
                    <ImagePlus className="h-3.5 w-3.5" />
                    <span>Tải ảnh từ máy</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="mt-1 text-[11px] text-cream-600">
                    Hoặc chọn nhanh ảnh mẫu bên dưới:
                  </p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.src}
                    type="button"
                    title={preset.label}
                    onClick={() => setImage(preset.src)}
                    className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                      image === preset.src
                        ? "border-tea-900 ring-2 ring-champagne-400"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={preset.src}
                      alt={preset.label}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
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
              ) : isEditing ? (
                <>
                  <Save className="h-4 w-4 text-champagne-400" />
                  <span>Lưu thay đổi</span>
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
      </div>

      {/* Cột phải: Bảng danh sách món (bấm vào dòng để chỉnh sửa) */}
      <div className="lg:col-span-8">
        <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-soft">
          <div className="flex items-center justify-between border-b border-cream-200 px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-tea-900">
                Danh sách món hiện có
              </h2>
              <p className="text-xs text-cream-700">
                Bấm vào bất kỳ món nào để chỉnh sửa tên, giá hoặc ảnh.
              </p>
            </div>
            <span className="rounded-full bg-tea-100 px-3 py-1 text-xs font-bold text-tea-800">
              {items.length} món
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100/80 text-xs font-bold uppercase tracking-wider text-cream-700">
                  <th className="w-14 px-5 py-3.5">STT</th>
                  <th className="w-20 px-4 py-3.5">Ảnh</th>
                  <th className="px-4 py-3.5">Tên món</th>
                  <th className="px-5 py-3.5 text-right">Giá tiền</th>
                  <th className="w-20 px-4 py-3.5 text-center">Sửa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {items.map((item, index) => {
                  const isSelected = editingId === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-tea-50/90"
                          : "hover:bg-cream-100/70"
                      }`}
                    >
                      <td className="px-5 py-3 font-semibold text-cream-700">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-cream-200 bg-cream-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="44px"
                            unoptimized={item.image.startsWith("data:")}
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-tea-900">
                        {item.name}
                      </td>
                      <td className="px-5 py-3 text-right font-extrabold text-tea-800">
                        {formatVND(item.price)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            isSelected
                              ? "bg-tea-900 text-champagne-300"
                              : "bg-cream-200/70 text-tea-800"
                          }`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
