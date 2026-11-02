import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import LoginForm from "./login-form";

export const metadata = {
  title: "Masuk | SIM Penjualan & Stok",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const redirectTo =
    typeof params?.redirectTo === "string" ? params.redirectTo : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              SIM Penjualan & Stok
            </h1>
            <p className="text-sm text-muted-foreground">
              Sistem Informasi Manajemen Penjualan
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">Masuk ke akun</CardTitle>
            <CardDescription>
              Masukkan email dan password untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm redirectTo={redirectTo}/>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SIM Penjualan & Stok
        </p>
      </div>
    </main>
  );
}
