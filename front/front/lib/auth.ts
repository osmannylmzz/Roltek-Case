import { api } from "./api";
import type { LoginReq } from "./types";
import { jwtDecode } from "jwt-decode";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}
export function setToken(token: string) { localStorage.setItem("token", token); }
export function clearToken() { localStorage.removeItem("token"); }

export function isLoggedIn() {
  const t = getToken();
  if (!t) return false;
  try {
    const payload: any = jwtDecode(t);
    if (!payload?.exp) return true;
    return Date.now() < payload.exp * 1000;
  } catch { return false; }
}

export async function login(data: LoginReq) {
  const res = await api.post("/auth/login", data);
  const body = res.data as any;

  let token: string | undefined =
    body?.accessToken || body?.token || body?.jwt || body?.id_token;

  if (!token) {
    const auth = res.headers?.authorization || res.headers?.Authorization;
    if (typeof auth === "string" && auth.toLowerCase().startsWith("bearer "))
      token = auth.split(" ")[1];
  }
  if (!token) throw new Error("Token bulunamadı");

  setToken(token);
  return { token };
}

export function logout() { clearToken(); }
