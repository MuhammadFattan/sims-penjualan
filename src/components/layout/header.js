"use client";

import { usePathname } from "next/navigation";
import MobileSidebar from "./mobile-sidebar";
import { getPageTitle } from "./nav-items";
import UserMenu from "./user-menu";

export default function Header({ user }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60 lg:px-6">
      <MobileSidebar />

      <div className="text-base font-semibold lg:text-lg">
        {getPageTitle(pathname)}
      </div>

      <div className="ml-auto">
        <UserMenu user={user} />
      </div>
    </header>
  );
}
