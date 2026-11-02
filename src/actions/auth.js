"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Hanya izinkan redirect ke path internal (cegah open redirect)
function saferRedirectPath(path) {
  if (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//")
  ) {
    return path;
  }
  return "/dashboard";
}

export async function login(value, redirectTo) {
  // Validasi ulang di server
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    const message = error.code === "invalid_credentials";
    error.message === "Invalid login credentials"
      ? "Email atau password salah."
      : error.code === "email_not_confirmed"
        ? "Email belum dikonfirmasi. Cek inbox/spam Anda."
        : "Gagal masuk. Silahkan coba lagi.";
    return { error: message };
  }

  revalidatePath("/", "layout");
  redirect(saferRedirectPath(redirectTo));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
