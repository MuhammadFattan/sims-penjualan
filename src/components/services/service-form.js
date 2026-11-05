import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
 } from "../ui/form";
 import { serviceDefaultValues, serviceSchema } from "@/lib/validations/service";
 import { createService, updateService } from "@/actions/service";
 import { formatRupiah } from "@/lib/validations/format";


// Isi form dari data service (mode edit) atau data kosong (mode create)
function getInitialVales(service) {
  if (!service) return serviceDefaultValues;
  return {
    name: service.name ?? "",
    description: service.description ?? "",
    category: service.category ?? "",
    price: service.price ?? "",
    duration_minutes: service.duration_minutes ?? "",
    is_active: service.is_active ?? true,
  };
}

/**
 * @param {object} props
 * @param {import { "@/types"}.Service} [props.service]
 * @param {(service: import { "@/types" }.Service) => void} [props.onSuccess]
 * @param {() => void} [props.onCancel]
 * @param {string[]} [props.categories]
 */
export default function ServiceForm({
  service,
  onSuccess,
  onCancel,
  categories = [],
}) {
  const isEdit = Boolean(service);

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: getInitialVales(service),
  });

  const { isSubmitting } = form.formState;

  // Pritinjau harga dalam format Rupiah
  const priceValue = form.watch("price");
  const pricePreview =
    priceValue !== "" &&
    Number.isFinite(Number(priceValue)) &&
    Number(priceValue) >= 0
      ? formatRupiah(Number(priceValue))
      : null;

  async function onSubmit(values) {
    try {
      const result = isEdit
        ? await updateService(service.id, values)
        : await createService(values);

      if (result?.error) {
        if (result.field) {
          form.setError(result.field, { message: result.error });
        }
        toast.error(result.error);
        return;
      }

      toast.success(
        isEdit ? "Layanan berhasil diperbarui" : "Layanan berhasil ditambahkan",
      );
      onSuccess?.(result.data);
    } catch {
      toast.error("Terjadi kesalahan jaringan. Silahkan coba lagi");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama layanan</FormLabel>
              <FormControl>
                <Input
                  placeholder="mis. Perbaikan Ringan"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField 
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga (Rp)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    placeholder="150000"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                {pricePreview && <FormDescription>{pricePreview}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durasi (menit)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="60"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

          <FormField 
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <FormControl>
                  <Input 
                    list="service-categories"
                    placeholder="mis. perbaikan"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                {categories.length > 0 && (
                  <datalist id="service-categories">
                    {categories.map((c) => (
                      <option value={c} key={c} />
                    ))}
                  </datalist>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Jelaskan layanan ini (opsional)"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Layanan aktif</FormLabel>
                  <FormDescription>
                    Layanan nonaktif tidak tampil untuk publik dan tidak bisa dipilih saat membuat order.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Batal
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting
                ? "Menyimpan..."
                : isEdit
                ? "Simpan perubahan"
                : "Tambah layanan"
              }
            </Button>
          </div>
      </form>
    </Form>
  )
}
