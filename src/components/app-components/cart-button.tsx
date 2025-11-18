// src/components/app-components/cart-button.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Trash2 } from "lucide-react"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { getProductImageUrl } from "@/lib/images"

export function CartButton() {
  const { items, total, count, removeItem, clearCart } = useCart()
  const hasItems = items.length > 0

  return (
    <Sheet>
      {/* 🔘 Botón header: icono + cantidad */}
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="inline-flex items-center gap-2 rounded-full border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-emerald-500 hover:text-emerald-600"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          <span className="tabular-nums">{count}</span>
        </Button>
      </SheetTrigger>

      {/* Menu */}
      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col gap-0 border-l border-slate-200 bg-white p-0"
      >
        {/* Header */}
        <SheetHeader className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-start gap-4">
            <SheetTitle className="text-base font-semibold text-slate-900">
              Your cart
            </SheetTitle>

            <div className="flex items-center gap-2">
              {hasItems && (
                <Button
                  type="button"
                  onClick={clearCart}
                  className="rounded-md bg-slate-100 px-2 text-[11px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-500"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {hasItems && (
            <p className="mt-1 text-xs text-slate-500">
              {count} item{count !== 1 && "s"} · Subtotal{" "}
              <span className="font-semibold text-slate-900">
                €{total.toFixed(2)}
              </span>
            </p>
          )}
        </SheetHeader>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!hasItems ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-slate-500">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <ShoppingCart className="h-7 w-7 text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-slate-700">Your cart is empty</p>
                <p className="mt-1 text-xs text-slate-400">
                  Add some padel gear to start your order.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const imageUrl = getProductImageUrl(item.image_url)

                const unitPrice =
                  typeof item.price === "number" && !Number.isNaN(item.price)
                    ? item.price
                    : 0
                const quantity = item.quantity ?? 1
                const lineTotal = unitPrice * quantity

                return (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1 text-sm">
                      <Link
                        href={`/products/${item.slug}`}
                        className="line-clamp-2 font-medium text-slate-900 hover:text-emerald-600"
                      >
                        {item.name}
                      </Link>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                          Qty:{" "}
                          <span className="font-semibold text-slate-800">
                            {quantity}
                          </span>
                          <span className="text-slate-400">
                            {" "}
                            · €{unitPrice.toFixed(2)} each
                          </span>
                        </span>
                        <span className="font-semibold text-slate-900">
                          €{lineTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      size="icon"
                      className="mt-1 h-7 w-7 shrink-0 rounded-full bg-red-500 hover:bg-red-600"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-3.5 w-2.5 text-white" />
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="border-t border-slate-200 px-5 py-4">
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-lg font-semibold text-slate-900">
                €{total.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <SheetClose asChild>
                <Link href="/checkout" className="w-full">
                  <Button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-medium text-white shadow-md hover:bg-emerald-700">
                    Proceed to checkout
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-slate-200 text-sm text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
                  >
                    Continue shopping
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
