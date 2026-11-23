"use client";

import { Plus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { useCart } from "./CartContext";

interface AddToCartButtonProps {
  item: MenuItem;
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(item)}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-tea-900 px-3.5 py-2 text-sm font-semibold text-cream-50 shadow-soft transition-all hover:bg-tea-800 active:scale-95"
    >
      <Plus className="h-4 w-4 text-champagne-400" />
      <span>Thêm</span>
    </button>
  );
}
