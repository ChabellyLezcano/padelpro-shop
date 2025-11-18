// src/components/app-components/products-related-carousel.tsx
"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  ProductCard,
  type ProductDiscount,
} from "@/components/app-components/product-card"
import { Button } from "@/components/ui/button"

type RelatedProduct = {
  id: string
  name: string
  slug: string
  price: number
  image_url: string | null
  stock?: number
  product_discounts?: ProductDiscount[] | null
}

type RelatedProductsCarouselProps = {
  products: RelatedProduct[]
  title?: string
  showViewAllLink?: boolean
}

export function RelatedProductsCarousel({
  products,
  title = "You may also like",
  showViewAllLink = true,
}: RelatedProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  if (products.length === 0) return null

  const showArrows = products.length >= 4

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const amount = container.clientWidth * 0.9

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  // Case 1: less than 4 products → simple layout
  if (!showArrows) {
    return (
      <section className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-[0.16em] text-slate-500 uppercase">
            {title}
          </h2>

          {showViewAllLink && (
            <Link
              href="/"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all products
            </Link>
          )}
        </div>

        {/* Centered layout */}
        <div className="flex justify-center">
          <div className="mx-auto flex w-full max-w-5xl gap-4">
            {products.map((p) => (
              <div key={p.id} className="max-w-[280px] min-w-[220px] flex-1">
                <ProductCard
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: p.price,
                    stock: p.stock ?? 0,
                    image_url: p.image_url,
                    product_discounts: p.product_discounts ?? [],
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Case 2: 4+ products → carousel
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-[0.16em] text-slate-500 uppercase">
          {title}
        </h2>

        {showViewAllLink && (
          <Link
            href="/"
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all products
          </Link>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Left button */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-1">
          <Button
            type="button"
            size="icon"
            onClick={() => scroll("left")}
            className="pointer-events-auto hidden h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-md hover:bg-slate-100 sm:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Right button */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-1">
          <Button
            type="button"
            size="icon"
            onClick={() => scroll("right")}
            className="pointer-events-auto hidden h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-md hover:bg-slate-100 sm:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex w-full gap-4 overflow-x-auto pt-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex w-full max-w-5xl gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="max-w-[260px] min-w-[220px] flex-1 sm:min-w-60 md:min-w-[260px]"
              >
                <ProductCard
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: p.price,
                    stock: p.stock ?? 0,
                    image_url: p.image_url,
                    product_discounts: p.product_discounts ?? [],
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
