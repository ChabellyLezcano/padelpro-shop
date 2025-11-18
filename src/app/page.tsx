// src/app/page.tsx
import Link from "next/link"
import { supabaseServer } from "@/lib/supabase-client"
import { ProductCard } from "@/components/app-components/product-card"
import { ProductsToolbar } from "@/components/app-components/products-toolbar"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 12

type SearchParams = {
  page?: string
  q?: string
  sort?: string
  category?: string
  brand?: string
}

// Types
type ProductReviewRow = {
  rating: number | null
}

type BrandRow = {
  name: string | null
}

type CategoryRow = {
  name: string | null
  slug: string | null
}

type ProductDiscountRow = {
  discount_type: "percentage" | "fixed"
  discount_value: number
  is_active?: boolean
  starts_at?: string | null
  ends_at?: string | null
}

type ProductRow = {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image_url: string | null
  product_discounts: ProductDiscountRow[] | null
  product_reviews: ProductReviewRow[] | null
  brands: BrandRow | BrandRow[] | null
  categories: CategoryRow | CategoryRow[] | null
}

type ProductWithRating = ProductRow & {
  averageRating: number
  reviewsCount: number
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const pageParam = Number(params?.page ?? "1")
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam

  const q = params?.q?.trim() ?? ""
  const sort = params?.sort ?? "popularity"

  const categoryParam = params?.category ?? ""
  const brandParam = params?.brand ?? ""

  const categoryFilters: string[] =
    categoryParam && categoryParam !== "all" ? categoryParam.split(",") : []

  const brandFilters: string[] =
    brandParam && brandParam !== "all"
      ? brandParam.split(",").map((b) => b.toLowerCase())
      : []

  // Base query
  let query = supabaseServer.from("products").select(`
      id,
      name,
      slug,
      price,
      stock,
      image_url,
      product_discounts!left (
        discount_type,
        discount_value,
        is_active,
        starts_at,
        ends_at
      ),
      product_reviews (
        rating
      ),
      brands ( name ),
      categories ( name, slug )
    `)

  if (q) {
    query = query.ilike("name", `%${q}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error loading products:", error)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Products
        </h1>
        <p className="text-sm text-red-500">
          There was a problem loading the products. Please try again later.
        </p>
      </div>
    )
  }

  const productsRaw = (data ?? []) as unknown as ProductRow[]

  // Helpers for brands
  const getCategorySlug = (
    categories: ProductRow["categories"]
  ): string | null => {
    if (!categories) return null
    if (Array.isArray(categories)) {
      return categories[0]?.slug ?? null
    }
    return categories.slug ?? null
  }

  const getBrandName = (brands: ProductRow["brands"]): string | null => {
    if (!brands) return null
    if (Array.isArray(brands)) {
      return brands[0]?.name ?? null
    }
    return brands.name ?? null
  }

  // Calculate rating
  const productsWithRating: ProductWithRating[] = productsRaw.map((p) => {
    const reviews = p.product_reviews ?? []
    const reviewsCount = reviews.length
    const averageRating =
      reviewsCount > 0
        ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviewsCount
        : 0

    return {
      ...p,
      averageRating,
      reviewsCount,
    }
  })

  // Filters
  let filtered: ProductWithRating[] = [...productsWithRating]

  if (categoryFilters.length > 0) {
    filtered = filtered.filter((p) => {
      const slug = getCategorySlug(p.categories)
      return slug ? categoryFilters.includes(slug) : false
    })
  }

  if (brandFilters.length > 0) {
    filtered = filtered.filter((p) => {
      const brandName = getBrandName(p.brands)?.toLowerCase()
      if (!brandName) return false
      return brandFilters.includes(brandName)
    })
  }

  // Sort
  const sorted = [...filtered]

  switch (sort) {
    case "name_asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "name_desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name))
      break
    case "price_asc":
      sorted.sort((a, b) => a.price - b.price)
      break
    case "price_desc":
      sorted.sort((a, b) => b.price - a.price)
      break
    case "popularity":
    default:
      sorted.sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating
        }
        if (b.reviewsCount !== a.reviewsCount) {
          return b.reviewsCount - a.reviewsCount
        }
        return a.name.localeCompare(b.name)
      })
  }

  const total = sorted.length
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1
  const safePage = Math.min(page, totalPages)

  const start = (safePage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const pageProducts = sorted.slice(start, end)

  const createPageLink = (pageNumber: number) => {
    const paramsObj = new URLSearchParams()

    if (q) paramsObj.set("q", q)
    if (sort && sort !== "popularity") paramsObj.set("sort", sort)
    if (categoryParam && categoryParam !== "all") {
      paramsObj.set("category", categoryParam)
    }
    if (brandParam && brandParam !== "all") {
      paramsObj.set("brand", brandParam)
    }
    if (pageNumber > 1) paramsObj.set("page", String(pageNumber))

    const queryString = paramsObj.toString()
    return queryString ? `/?${queryString}` : "/"
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Products
        </h1>
        <p className="text-sm text-slate-500">
          Browse our selection of professional padel gear.
        </p>
      </section>

      {/* Toolbar */}
      <ProductsToolbar initialQuery={q} initialSort={sort} />

      {/* Grid */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
            All products
          </p>
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {pageProducts.length}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{total}</span>{" "}
            products · Page{" "}
            <span className="font-semibold text-slate-700">{safePage}</span> /{" "}
            {totalPages}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pageProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="mt-6 flex items-center justify-center gap-2 text-sm"
          aria-label="Products pagination"
        >
          {/* Previous */}
          <Link
            href={createPageLink(safePage - 1)}
            aria-disabled={safePage === 1}
            className={`inline-flex h-9 items-center rounded-full px-3 text-xs font-medium ${
              safePage === 1
                ? "cursor-not-allowed bg-slate-100 text-slate-300"
                : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            Previous
          </Link>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1
              const isCurrent = pageNumber === safePage

              return (
                <Link
                  key={pageNumber}
                  href={createPageLink(pageNumber)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-medium ${
                    isCurrent
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </Link>
              )
            })}
          </div>

          {/* Next */}
          <Link
            href={createPageLink(safePage + 1)}
            aria-disabled={safePage === totalPages}
            className={`inline-flex h-9 items-center rounded-full px-3 text-xs font-medium ${
              safePage === totalPages
                ? "cursor-not-allowed bg-slate-100 text-slate-300"
                : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            Next
          </Link>
        </nav>
      )}
    </div>
  )
}
