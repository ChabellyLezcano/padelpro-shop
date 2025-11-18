// src/components/app-components/cart-indicator.tsx
"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"

export function CartIndicator() {
  const { count } = useCart()

  return (
    <Link
      href="/checkout"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-emerald-500 hover:text-emerald-600"
      aria-label="Open cart"
    >
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      <span className="text-xs tabular-nums sm:text-sm">{count}</span>
    </Link>
  )
}
