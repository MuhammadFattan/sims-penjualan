"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { usePathname } from "next/navigation";
import { isActive, NAV_ITEMS } from "./nav-items";
import { cn } from "cn";

export default function SidebarContent({ onNavigate }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-14 items-center gap-3 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Package className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold tracking-tight">
          SIM Penjualan & Stok
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} SIM Penjualan & Stok
      </div>
    </div>
  );
}
