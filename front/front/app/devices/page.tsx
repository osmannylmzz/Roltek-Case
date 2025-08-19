"use client";
import RequireAuth from "@/components/RequiredAuth";
import DeviceForm from "@/components/DeviceForm";
import DeviceTable from "@/components/DeviceTable";
import { api } from "@/lib/api";
import type { Device, Page, DeviceType } from "@/lib/types";
import { DEVICE_TYPES } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/lib/auth";
import { useEffect, useMemo, useState } from "react";

export default function DevicesPage() {
  return (
    <RequireAuth>
      <DevicesInner />
    </RequireAuth>
  );
}

function DevicesInner() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Device | null>(null);

  // arama & filtre & pagination state
  const [q, setQ] = useState("");
  const [type, setType] = useState<DeviceType | "">("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const sort = "createdAt,desc";

  // liste (Page<Device>) — server-side
 const list = useQuery({
  queryKey: ["devices", { q, type, page, size, sort }],
  queryFn: async (): Promise<Page<Device>> =>
    (await api.get<Page<Device>>("/devices", {
      params: { q, type: type || undefined, page, size, sort },
    })).data,
  placeholderData: (prev) => prev,   // v5 karşılığı
});
  // create/update/delete
  const createMut = useMutation({
    mutationFn: (body: Partial<Device>) => api.post("/devices", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["devices"] });
    },
  });

  const updateMut = useMutation({
    mutationFn: (d: { id: string; body: Partial<Device> }) => api.put(`/devices/${d.id}`, d.body),
    onSuccess: () => {
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["devices"] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/devices/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["devices"] }),
  });

  // arama yapıldığında ilk sayfaya dön
  useEffect(() => { setPage(0); }, [q, type, size]);

  const devices = list.data?.content ?? [];
  const totalPages = list.data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cihazlar</h1>
          <p className="text-sm text-slate-500">Cihaz ekle, düzenle veya sil.</p>
        </div>
        <button
          onClick={() => { logout(); location.href = "/login"; }}
          className="rounded-xl border px-4 py-2 hover:bg-slate-50 self-start"
        >
          Çıkış
        </button>
      </header>

      {/* Arama & Filtre */}
      <section className="rounded-2xl border bg-white p-4 shadow flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium">Ara</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ad / seri no"
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
        <div className="w-full md:w-60">
          <label className="text-sm font-medium">Tür</label>
          <select
            value={type}
            onChange={(e) => setType((e.target.value || "") as any)}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          >
            <option value="">Hepsi</option>
            {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="w-full md:w-40">
          <label className="text-sm font-medium">Sayfa Boyutu</label>
          <select
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          >
            {[5,10,20,50].map(s => <option key={s} value={s}>{s}/sayfa</option>)}
          </select>
        </div>
      </section>

      {/* Form */}
      <section className="rounded-2xl border bg-white p-4 shadow">
        <h2 className="mb-3 font-semibold">{editing ? "Cihazı Düzenle" : "Yeni Cihaz Ekle"}</h2>
        <DeviceForm
          initial={editing ?? undefined}
          onCancel={() => setEditing(null)}
          onSubmit={async (v) => {
            if (editing) await updateMut.mutateAsync({ id: editing.id, body: v });
            else await createMut.mutateAsync(v);
          }}
        />
      </section>

      {/* Liste + durumlar */}
      <section className="rounded-2xl border bg-white p-4 shadow space-y-3">
        {list.isLoading && (
          <div className="flex items-center gap-3 p-2 text-slate-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></span>
            Liste yükleniyor...
          </div>
        )}
        {list.isError && <p className="text-red-600">Liste alınamadı.</p>}

        {!list.isLoading && !list.isError && (
          <>
            <DeviceTable
              data={devices}
              onEdit={(d) => setEditing(d)}
              onDelete={(d) => {
                if (confirm(`Silinsin mi? ${d.name}`)) deleteMut.mutate(d.id);
              }}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                Sayfa {page + 1} / {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  className="rounded-lg border px-3 py-1 disabled:opacity-50"
                >
                  Önceki
                </button>
                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border px-3 py-1 disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
