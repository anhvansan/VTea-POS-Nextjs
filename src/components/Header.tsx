import Link from "next/link";
import { BarChart3, CupSoda, LayoutGrid, UtensilsCrossed } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-tea-800/20 bg-tea-900 text-cream-100 shadow-soft">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-champagne-500 text-tea-950 shadow-gold">
            <CupSoda className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            {/* DEMO CI/CD: Đổi "VTea POS" thành "VTea Express" rồi git push */}
            <span className="text-lg font-bold tracking-tight text-cream-50">
              VTea POS
            </span>
            <span className="text-xs text-tea-200">
              Hệ thống bán hàng trà sữa
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-tea-800/80 px-3.5 py-2 text-sm font-medium text-cream-100 transition-colors hover:bg-tea-700"
          >
            <LayoutGrid className="h-4 w-4 text-champagne-400" />
            <span>Bán hàng POS</span>
          </Link>
          <Link
            href="/statistics"
            className="inline-flex items-center gap-2 rounded-xl border border-tea-700 bg-tea-950/50 px-3.5 py-2 text-sm font-medium text-cream-100 transition-colors hover:border-champagne-500/60 hover:bg-tea-800"
          >
            <BarChart3 className="h-4 w-4 text-champagne-400" />
            <span>Thống kê</span>
          </Link>
          <Link
            href="/admin/menu"
            className="inline-flex items-center gap-2 rounded-xl border border-tea-700 bg-tea-950/50 px-3.5 py-2 text-sm font-medium text-cream-100 transition-colors hover:border-champagne-500/60 hover:bg-tea-800"
          >
            <UtensilsCrossed className="h-4 w-4 text-champagne-400" />
            <span>Quản lý Thực đơn</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
