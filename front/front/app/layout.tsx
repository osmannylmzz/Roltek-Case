import "./globals.css";
import Providers from "./providers";
import Link from "next/link";
import Script from "next/script";

export const metadata = { title: "Device UI", description: "Device Management" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* DEV/GEÇİCİ: Tailwind CDN – hemen çalışsın */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 antialiased">
        <Providers>
          <nav className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-slate-900">
                  <path fill="currentColor" d="M3 12a9 9 0 1 1 18 0a9 9 0 0 1-18 0m9-7v14a7 7 0 0 0 0-14"/>
                </svg>
                <span>Roltek Devices</span>
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/devices" className="hover:text-slate-700">Cihazlar</Link>
                <Link href="/login" className="text-slate-500 hover:text-slate-700">Giriş</Link>
              </div>
            </div>
          </nav>

          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="py-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Roltek
          </footer>
        </Providers>
      </body>
    </html>
  );
}
