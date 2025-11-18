// src/app/layout.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

import { CartButton } from "@/components/app-components/cart-button"
import { CartProviderClient } from "@/components/app-components/cart-provider-client"
import { Toaster } from "@/components/ui/toaster"
import { TennisBallIcon } from "@/icons/tenis-ball-icon"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "PadelPro Shop",
  description: "Your professional padel store",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.className} min-h-screen bg-slate-50 text-slate-900`}
      >
        <CartProviderClient>
          <div className="flex min-h-screen flex-col">
            <header className="border-b bg-white">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link
                  href="/"
                  className="inline-flex cursor-pointer items-center gap-2"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                    <TennisBallIcon className="h-5 w-5" />
                  </span>

                  <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight">
                    <span className="text-emerald-600">Padel</span>
                    <span>Pro</span>
                    <span className="text-slate-400">Shop</span>
                  </div>
                </Link>

                <nav className="flex items-center gap-6 text-sm">
                  <CartButton />
                </nav>
              </div>
            </header>

            <main className="flex-1">
              <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
            </main>

            <footer className="border-t bg-white">
              <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-4 text-xs text-slate-500">
                PadelPro Shop is created by Chabelly Lezcano
              </div>
            </footer>
          </div>

          <Toaster />
        </CartProviderClient>
      </body>
    </html>
  )
}
