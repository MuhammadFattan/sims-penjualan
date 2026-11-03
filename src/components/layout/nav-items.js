import { CirclePlus, House, List, Sparkles, Users } from "lucide-react";

export const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: House },
  { title: "POS / Buat Order", href: "/pos", icon: CirclePlus },
  { title: "Orders", href: "/orders", icon: List },
  { title: "Services", href: "/services", icon: Sparkles },
  { title: "Customers", href: "/customers", icon: Users },
];

// Aktif jika path sama persis atau anak dari href
export function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname) {
  return (
    NAV_ITEMS.find((item) => isActive(pathname, item.href))?.title ??
    "Dashboard"
  );
}
