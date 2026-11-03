import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ childern }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lapisan keamanan tambahan
  if (!user) redirect("/login");

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email.split("@")[0] ||
    "Pengguna";

  return (
    <div className="min-h-screen bg-muted/40">
      <Sidebar />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header user={{ name, email: user.email ?? "" }} />
        <main className="flex-1 p-4 lg:p-6">{childern}</main>
      </div>
    </div>
  );
}
