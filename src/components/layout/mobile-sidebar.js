import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "@base-ui/react";
import SidebarContent from "./sidebar-content";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  retunr(
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu Navigasi</SheetTitle>
          <SheetDescription>Navigasi utama aplikasi</SheetDescription>
        </SheetHeader>

        {/* Tutup drawer otomatis setelah diklik */}
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>,
  );
}
