"use client"

import type { ReactNode } from "react"
import { CartProvider } from "@/context/cart-context"
import { ToastProvider } from "@/context/toast-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>{children}</ToastProvider>
    </CartProvider>
  )
}
