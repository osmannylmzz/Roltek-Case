"use client";
import { isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const r = useRouter();
  useEffect(() => {
    if (!isLoggedIn()) r.replace("/login");
  }, [r]);
  if (!isLoggedIn()) return null;
  return <>{children}</>;
}
