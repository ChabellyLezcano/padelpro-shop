// src/app/products/[slug]/page.tsx
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, Truck, ShieldCheck } from "lucide-react"

import { supabaseServer } from "@/lib/supabase-client"
import { getProductImageUrl } from "@/lib/images"
import { Card, CardContent } from "@/components/ui/card"
import { ProductReviews } from "@/components/app-components/product-reviews"
import { RelatedProductsCarousel } from "@/components/app-components/products-related-carousel"
import { AddToCartButton } from "@/components/app-components/add-to-cart-button"

import type { Product } from "@/types/product"

type PageProps = {
  params: Promise<{ slug: string }>
}

type ProductAttributes = Record<string, unknown>

async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseServer
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      description,
      price,
      stock,
      image_url,
      brand_id,
      category_id,
      attributes,
      brands ( name ),
      categories ( name, slug ),
      product_discounts (
        discount_type,
        discount_value,
        is_active,
        starts_at,
        ends_at
      ),
      product_reviews (
        id,
        rating,
        title,
        comment,
        created_at
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    console.error("Error loading product:", error)
    return null
  }

  return data as Product | null
}

async function getRelatedProducts(
  categoryId: string | null,
  currentProductId: string
) {
  if (!categoryId) return []

  const { data, error } = await supabaseServer
    .from("products")
    .select("id, name, slug, price, image_url, stock, category_id")
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .order("name", { ascending: true })
    .limit(8)

  if (error) {
    console.error("Error loading related products:", error)
    return []
  }

  return data ?? []
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product not found – PadelPro Shop",
    }
  }

  return {
    title: `${product.name} – PadelPro Shop`,
    description:
      product.description ??
      "Discover premium padel rackets, balls, shoes and accessories at PadelPro Shop.",
  }
}

function getPriceInfo(product: Product) {
  const discount = product.product_discounts?.[0]
  let hasDiscount = false
  let finalPrice = product.price
  let discountLabel: string | null = null

  if (discount && discount.discount_value > 0) {
    hasDiscount = true
    if (discount.discount_type === "percentage") {
      finalPrice = product.price * (1 - discount.discount_value / 100)
      discountLabel = `-${discount.discount_value}%`
    } else {
      finalPrice = product.price - discount.discount_value
      if (finalPrice < 0) finalPrice = 0
      const pct = Math.round(100 - (finalPrice / product.price) * 100)
      discountLabel = pct > 0 ? `-${pct}%` : "Offer"
    }
  }

  return { hasDiscount, finalPrice, discountLabel }
}

function formatAttributeKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatAttributeValue(raw: unknown): string {
  if (raw === null || raw === undefined) return ""

  if (typeof raw === "number" || typeof raw === "boolean") {
    return String(raw)
  }

  const value = String(raw).trim()
  if (!value) return ""

  return value
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length === 0 ? "" : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ")
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const imageUrl = getProductImageUrl(product.image_url)
  const { hasDiscount, finalPrice, discountLabel } = getPriceInfo(product)

  const reviews = product.product_reviews ?? []
  const reviewCount = reviews.length
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewCount
      : 0

  const relatedProducts = await getRelatedProducts(
    product.category_id,
    product.id
  )

  const inStock = product.stock > 0
  const attributes = (product.attributes ?? {}) as ProductAttributes
  const hasAttributes = Object.keys(attributes).length > 0

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="text-md text-slate-500 sm:text-sm">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-emerald-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-slate-800">{product.name}</li>
        </ol>
      </nav>

      {/* Main Block */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        {/* Image */}
        <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white">
          <div className="relative h-80 w-full overflow-hidden bg-slate-100 sm:h-96 md:h-full">
            <Image
              src={imageUrl}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-cover"
              priority
            />

            {hasDiscount && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
                  {discountLabel ?? "Offer"}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Product info */}
        <section className="flex flex-col gap-6">
          {/* Title + brand + rating */}
          <div className="space-y-3">
            <p className="text-md font-semibold tracking-[0.18em] text-emerald-600 uppercase sm:text-sm">
              {product.categories?.name ?? "Padel gear"}
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="text-md flex flex-wrap items-center gap-3 text-slate-500 sm:text-sm">
              {product.brands?.name && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-slate-700 uppercase">
                  {product.brands.name}
                </span>
              )}

              {reviewCount > 0 && (
                <div className="text-md flex items-center gap-1.5 sm:text-sm">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.round(averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-slate-800">
                    {averageRating.toFixed(1)}
                  </span>
                  <span>
                    · {reviewCount} review{reviewCount !== 1 && "s"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Price + stock + CTA */}
          <Card className="border-slate-200 bg-white">
            <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                  {hasDiscount ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-red-500 line-through">
                          €{product.price.toFixed(2)}
                        </span>
                        <span className="text-2xl font-semibold text-slate-900">
                          €{finalPrice.toFixed(2)}
                        </span>
                      </div>
                      {discountLabel && (
                        <p className="text-md font-medium text-red-600 sm:text-sm">
                          You save {discountLabel.replace("-", "")} today
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-semibold text-slate-900">
                      €{product.price.toFixed(2)}
                    </span>
                  )}

                  <p
                    className={`text-md flex items-center gap-1 sm:text-sm ${
                      inStock ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        inStock ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    {inStock
                      ? `${product.stock} units available`
                      : "Out of stock"}
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
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 text-sm font-medium text-white shadow-md hover:bg-emerald-700"
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
                    quantity={1}
                    variant="notify"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-medium text-white shadow-md hover:bg-slate-800"
                  />
                )}
              </div>

              <div className="text-md flex flex-wrap gap-4 border-t border-slate-200 pt-3 text-slate-600 sm:text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Fast shipping within 24–48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Secure payments & returns</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description and details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold tracking-[0.16em] text-slate-500 uppercase">
                Product details
              </h2>
              <p className="text-sm leading-relaxed text-slate-700">
                {product.description ||
                  "High-quality padel product designed for performance, comfort and durability on court."}
              </p>
            </div>

            {hasAttributes && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-[0.16em] text-slate-500 uppercase">
                  Specifications
                </h3>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
                  <dl className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    {Object.entries(attributes).map(([key, value]) => (
                      <div key={key} className="px-4 py-3 text-xs sm:text-sm">
                        <dt className="mb-1 flex items-center font-semibold text-slate-500 uppercase">
                          <span />
                          {formatAttributeKey(key)}
                        </dt>
                        <dd className="text-slate-900">
                          {formatAttributeValue(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>

      {/* Reviews */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-[0.16em] text-slate-500 uppercase">
            Reviews
          </h2>
          {reviewCount > 0 && (
            <p className="text-md text-slate-500 sm:text-sm">
              {reviewCount} review{reviewCount !== 1 && "s"} · Average{" "}
              {averageRating.toFixed(1)}/5
            </p>
          )}
        </div>

        <ProductReviews reviews={reviews} />
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProductsCarousel
          products={relatedProducts.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            image_url: p.image_url,
            stock: p.stock,
            product_discounts: [],
          }))}
        />
      )}
    </div>
  )
}
