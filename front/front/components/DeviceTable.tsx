"use client";
import type { Device } from "@/lib/types";

function TypeBadge({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
      {value}
    </span>
  );
}

export default function DeviceTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Device[];
  onEdit: (d: Device) => void;
  onDelete: (d: Device) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow">
      <table className="w-full text-sm">
        <thead className="text-left text-slate-500">
          <tr className="border-b bg-slate-50">
            <th className="p-3">Ad</th>
            <th className="p-3">Tür</th>
            <th className="p-3">Seri No</th>
            <th className="p-3">Oluşturma</th>
            <th className="p-3 w-40"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id} className="border-b last:border-0 hover:bg-slate-50/60">
              <td className="p-3 font-medium">{d.name}</td>
              <td className="p-3"><TypeBadge value={d.type} /></td>
              <td className="p-3">{d.serialNumber}</td>
              <td className="p-3 text-slate-500">{new Date(d.createdAt).toLocaleString()}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(d)} className="px-3 py-1 rounded-lg border hover:bg-slate-50">Düzenle</button>
                  <button onClick={() => onDelete(d)} className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700">Sil</button>
                </div>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-500">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
