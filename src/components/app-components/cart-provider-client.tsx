"use client"

import { CartProvider } from "@/context/cart-context"

export function CartProviderClient({
  children,
}: {
  children: React.ReactNode
}) {
  return <CartProvider>{children}</CartProvider>
}
