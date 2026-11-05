import z from "zod";

// Batas kolom integer di PostgreSQL
const MAX_INT = 2_147_483_647;

// String kosong dari input from dianggap tidak diisi/null
const emptyToNull = (value) =>
  value === "" || value === undefined ? null : value;

// Teks optional
const optionalText = (label, max) =>
  z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .nullish()
    .transform((v) => v || null);

export const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama layanan wajib diisi")
    .min(3, "Nama layanan minimal 3 karakter")
    .max(100, "Nama layanan maksimal 100 karakter"),

  desription: optionalText("Deskripsi", 500),

  category: optionalText("Kategori", 50),

  price: z.coerce
    .number({ error: "Harga harus berupa angka" })
    .int("Harga harus bilangan bulat (tanpa koma)")
    .min(0, "Harga tidak boleh negatif")
    .max(MAX_INT, "Harga terlalu besar"),

  duration_minutes: z.preprocess(
    emptyToNull,
    z.coerce
      .number({ error: "Durasi harus berupa angka" })
      .int("Durasi harus bilangan bulat")
      .positive("Durasi harus lebih dari 0")
      .max(MAX_INT, "Durasi terlalu besar")
      .nullable(),
  ),

  is_active: z.boolean().default(true),
});

// Update form
export const updateServiceSchema = serviceSchema.extend({
  id: z.string().uuid("ID layanan tidak valid"),
});

// Hapus / toggle status
export const serviceIdSchema = z.object({
  id: z.string().uuid("ID layanan tidak valid"),
});

// Filter pada halaman daftar layanan
export const serviceFilterSchema = z.object({
  search: z.string().trim().optional().default(""),
  category: z.string().trim().optional(),
  status: z.enum(["all", "active", "inactive"]).default("all"),
});

// Nilai awal form (string kosong)
export const serviceDefaultValues = {
  name: "",
  desription: "",
  category: "",
  price: "",
  duration_minutes: "",
  is_active: true,
};

/**
 * Type inference (JSDoc):
 * 
 * @typedef {import("zod").infer<typeof serviceSchema>} ServiceInput
 *  Data bersih hasil validasi
 * 
 * @typedef {import("zod").infer<typeof updateServiceSchema>} ServiceUpdateInput
 * 
 * @typedef {import("zod").infer<typeof serviceSchema>} ServiceFormValue
 *  Bentuk nilai mentah di form
 * 
 * @typedef {import("zod").infer<typeof serviceFilterSchema>} ServiceFilter
 */
