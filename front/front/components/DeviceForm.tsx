"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Device } from "@/lib/types";
import { DEVICE_TYPES } from "@/lib/types";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, "Cihaz adı gerekli"),
  type: z.enum(DEVICE_TYPES),              // <-- sadece bu
  serialNumber: z.string().min(1, "Seri numarası gerekli"),
});
type Form = z.infer<typeof schema>;

export default function DeviceForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Device>;
  onSubmit: (v: Form) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<Form>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: initial?.name || "",
        type: (initial?.type as any) || "SENSOR",
        serialNumber: initial?.serialNumber || "",
      }
    });

  useEffect(() => {
    reset({
      name: initial?.name || "",
      type: (initial?.type as any) || "SENSOR",
      serialNumber: initial?.serialNumber || "",
    });
  }, [initial, reset]);

  return (
    <form
      onSubmit={handleSubmit(async (v) => { await onSubmit(v); })}
      className="grid gap-3 md:grid-cols-3"
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Ad</label>
        <input className="w-full rounded-xl border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20" placeholder="Örn: Ortam Sensörü" {...register("name")} />
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Tür</label>
        <select
          className="w-full rounded-xl border px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          {...register("type")}
        >
          {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.type && <p className="text-xs text-red-600">{errors.type.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Seri No</label>
        <input className="w-full rounded-xl border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20" placeholder="SN-001234" {...register("serialNumber")} />
        {errors.serialNumber && <p className="text-xs text-red-600">{errors.serialNumber.message}</p>}
      </div>

      <div className="md:col-span-3 flex items-center gap-2 pt-1.5">
        <button className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
          Kaydet
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-xl border px-4 py-2 hover:bg-slate-50">
            Vazgeç
          </button>
        )}
      </div>
    </form>
  );
}
