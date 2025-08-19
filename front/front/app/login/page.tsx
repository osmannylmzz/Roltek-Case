"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Geçerli e-posta giriniz"),
  password: z.string().min(6, "En az 6 karakter"),
});
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => { if (isLoggedIn()) router.replace("/devices"); }, [router]);

  const onSubmit = async (data: Form) => {
    if (loading) return;
    setLoading(true);
    try {
      await login(data);
      toast.success("Giriş başarılı");
      router.replace("/devices");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Giriş başarısız!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-7rem)] place-items-center">
      <div className="w-full max-w-sm rounded-2xl border bg-white/80 p-6 shadow-lg backdrop-blur">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Giriş Yap</h1>
          <p className="text-sm text-slate-500">Hesabınla oturum aç ve cihazlarını yönet.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">E-posta</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-xl border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              placeholder="ornek@site.com"
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Şifre</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                {...register("password")}
                className="w-full rounded-xl border px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-xs"
              >
                {show ? "Gizle" : "Göster"}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"></span>}
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
