"use server";

import { createClient } from "@/lib/supabase/server";
import { serviceIdSchema, serviceSchema } from "@/lib/validations/service";
import { revalidatePath } from "next/cache";

function mapDbError(error) {
  if (error.code === "23505") {
    return { error: "Nama layanan sudah digunakan.", field: "name" };
  }
  return { error: "Gagal menyimpan layanan. Silahkan coba lagi." };
}

export async function createService(values) {
  const parsed = serviceSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi berakhir. Silahkan login kembali." };

  const { data, error } = await supabase
    .from("service")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return mapDbError(error);

  revalidatePath("/services");
  return { success: true, data };
}

export async function updateService(id, values) {
  const parsedId = serviceIdSchema.safeParse({ id });
  if (!parsedId.success) return { error: parsedId.error.issues[0].message };

  const parsed = serviceSchema.safeParse(values);
  if (!parsed.success) return { error: parsedId.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi berakhir. Silahkan login kembali." };

  const { data, error } = await supabase
    .from("service")
    .update(parsed.data)
    .eq("id", parsedId.data.id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return { error: "Layanan tidak ditemukan." };
    return mapDbError(error);
  }

  revalidatePath("/services");
  return { success: true, data };
}
