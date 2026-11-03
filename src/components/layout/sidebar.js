import SidebarContent from "./sidebar-content";

export default function  Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
      <SidebarContent/>
    </aside>
  )
}