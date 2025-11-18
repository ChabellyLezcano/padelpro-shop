// src/components/app-components/product-card.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Tag } from "lucide-react"

import { getProductImageUrl } from "@/lib/images"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "./add-to-cart-button"

export type ProductDiscount = {
  discount_type: "percentage" | "fixed"
  discount_value: number
  is_active?: boolean
  starts_at?: string | null
  ends_at?: string | null
}

type Product = {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image_url: string | null
  product_discounts?: ProductDiscount[] | null
}

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product.image_url)
  const inStock = product.stock > 0

  const discount = product.product_discounts?.[0]

  let hasDiscount = false
  let finalPrice = product.price
  let discountText: string | null = null

  if (discount && discount.discount_value > 0) {
    hasDiscount = true
    if (discount.discount_type === "percentage") {
      finalPrice = product.price * (1 - discount.discount_value / 100)
      discountText = `-${discount.discount_value}%`
    } else {
      finalPrice = product.price - discount.discount_value
      if (finalPrice < 0) finalPrice = 0
      const pct = Math.round(100 - (finalPrice / product.price) * 100)
      discountText = pct > 0 ? `-${pct}%` : "Offer"
    }
  }

  return (
    <Card
      className={[
        "group flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-transform",
        inStock
          ? "border-slate-200 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-lg"
          : "border-slate-200 bg-slate-50 opacity-60 grayscale",
      ].join(" ")}
    >
      {/* Imagen */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-56 w-full overflow-hidden rounded-t-3xl bg-slate-100">
          <Image
            src={imageUrl}
            alt={product.name}
            width={500}
            height={380}
            className={[
              "h-full w-full object-cover transition duration-300",
              inStock ? "group-hover:scale-105" : "grayscale",
            ].join(" ")}
          />

          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <span
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-semibold tracking-[0.16em] uppercase",
                  inStock
                    ? "bg-red-600 text-white"
                    : "bg-slate-400 text-slate-100",
                ].join(" ")}
              >
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{discountText ?? "Offer"}</span>
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        {/* Nombre del producto */}
        <Link
          href={`/products/${product.slug}`}
          className={[
            "line-clamp-2 text-sm font-semibold tracking-tight",
            inStock
              ? "text-slate-900 hover:text-emerald-600"
              : "text-slate-500",
          ].join(" ")}
        >
          {product.name}
        </Link>

        {/* Precio + stock + botón */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-xs font-semibold text-red-500 line-through">
                    €{product.price.toFixed(2)}
                  </span>
                  <span
                    className={[
                      "text-xl font-semibold",
                      inStock ? "text-slate-900" : "text-slate-500",
                    ].join(" ")}
                  >
                    €{finalPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span
                  className={[
                    "text-xl font-semibold",
                    inStock ? "text-slate-900" : "text-slate-500",
                  ].join(" ")}
                >
                  €{product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock */}
            <p
              className={[
                "flex items-center gap-1 text-xs",
                inStock ? "text-emerald-600" : "text-gray-500",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  inStock ? "bg-emerald-500" : "bg-slate-900",
                ].join(" ")}
              />
              {inStock ? `Stock` : `Out of stock`}
            </p>
          </div>

          {inStock ? (
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: finalPrice,
                image_url: product.image_url,
              }}
              quantity={1}
              className="bg-emerald-600 hover:bg-emerald-700"
              iconOnly
            />
          ) : (
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: finalPrice,
                image_url: product.image_url,
              }}
              variant="notify"
              className="bg-slate-900 hover:bg-slate-700"
              iconOnly
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
