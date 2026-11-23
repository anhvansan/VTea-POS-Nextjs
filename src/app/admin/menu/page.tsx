import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { getMenuItems } from "@/lib/data";
import { MenuManager } from "@/components/admin/MenuManager";

export default function AdminMenuPage() {
  const menuItems = getMenuItems();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-tea-100 px-3 py-1 text-xs font-semibold text-tea-800">
            <UtensilsCrossed className="h-3.5 w-3.5 text-tea-600" />
            <span>Quản lý thực đơn</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-tea-900 sm:text-3xl">
            Quản lý Thực đơn
          </h1>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-tea-900 shadow-soft transition-colors hover:bg-cream-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang POS</span>
        </Link>
      </div>

      <MenuManager items={menuItems} />
    </div>
  );
}
