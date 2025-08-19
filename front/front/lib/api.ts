import axios from "axios";
import { logout } from "./auth";
import { toast } from "react-hot-toast";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const t = localStorage.getItem("token");
    if (t) config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.error || err?.message || "Bir şeyler ters gitti";
    if (status === 401) {
      toast.error("Oturum süresi doldu. Yeniden giriş yapın.");
      logout();
      if (typeof window !== "undefined") window.location.href = "/login";
    } else {
      toast.error(msg);
    }
    return Promise.reject(err);
  }
);
