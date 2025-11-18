// src/components/products/products-toolbar.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, FormEvent } from "react"
import { Search, RotateCcw } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
]

// ⚠️ Importante: NUNCA value="" en los SelectItem
const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "rackets", label: "Rackets" },
  { value: "balls", label: "Balls" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
]

const BRAND_OPTIONS = [
  { value: "all", label: "All brands" },
  { value: "adidas", label: "Adidas" },
  { value: "babolat", label: "Babolat" },
  { value: "head", label: "Head" },
  { value: "nox", label: "Nox" },
]

type ProductsToolbarProps = {
  initialQuery: string
  initialSort: string
}

export function ProductsToolbar({
  initialQuery,
  initialSort,
}: ProductsToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialQuery ?? "")
  const [sort, setSort] = useState(initialSort || "popularity")
  const [category, setCategory] = useState<string>(
    (searchParams?.get("category") ?? "") || "all"
  )
  const [brand, setBrand] = useState<string>(
    (searchParams?.get("brand") ?? "") || "all"
  )

  useEffect(() => {
    const currentQ = searchParams?.get("q") ?? ""
    const currentSort = searchParams?.get("sort") ?? "popularity"
    const currentCategory = searchParams?.get("category") ?? ""
    const currentBrand = searchParams?.get("brand") ?? ""

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(currentQ)
    setSort(currentSort)
    setCategory(currentCategory || "all")
    setBrand(currentBrand || "all")
  }, [searchParams])

  const updateUrl = (next: {
    q?: string
    sort?: string
    category?: string
    brand?: string
    page?: string
  }) => {
    const params = new URLSearchParams(searchParams?.toString())

    if (next.q !== undefined) {
      const value = next.q.trim()
      if (value) params.set("q", value)
      else params.delete("q")
    }

    if (next.sort !== undefined) {
      if (next.sort) params.set("sort", next.sort)
      else params.delete("sort")
    }

    if (next.category !== undefined) {
      // "all" => sin filtro (borrar de la URL)
      if (next.category && next.category !== "all") {
        params.set("category", next.category)
      } else {
        params.delete("category")
      }
    }

    if (next.brand !== undefined) {
      if (next.brand && next.brand !== "all") {
        params.set("brand", next.brand)
      } else {
        params.delete("brand")
      }
    }

    if (next.page !== undefined) {
      if (next.page) params.set("page", next.page)
      else params.delete("page")
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const value = search.trim()

    if (!value) {
      setSearch("")
      updateUrl({ q: "", page: "1" })
      return
    }

    updateUrl({ q: value, page: "1" })
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    updateUrl({ sort: value, page: "1" })
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateUrl({ category: value, page: "1" })
  }

  const handleBrandChange = (value: string) => {
    setBrand(value)
    updateUrl({ brand: value, page: "1" })
  }

  const handleResetFilters = () => {
    setSearch("")
    setSort("popularity")
    setCategory("all")
    setBrand("all")

    updateUrl({
      q: "",
      sort: "popularity",
      category: "all",
      brand: "all",
      page: "1",
    })
  }

  return (
    <section
      aria-label="Products filters"
      className="rounded-3xl border border-slate-200 bg-white/90 px-3 py-3 shadow-sm sm:px-4 sm:py-4"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Search + botón lupa a la derecha */}
        <div className="flex w-full items-center gap-2">
          <span className="sr-only" id="products-search-label">
            Search products
          </span>

          <div className="relative flex-1">
            <Input
              id="products-search"
              aria-labelledby="products-search-label"
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => {
                const next = e.target.value
                setSearch(next)

                if (next.trim() === "") {
                  updateUrl({ q: "", page: "1" })
                }
              }}
              className="h-9 w-full rounded-full bg-slate-50 pr-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white sm:h-10"
            />
          </div>

          {/* Lupa en círculo perfecto, fuera del input */}
          <button
            type="submit"
            aria-label="Search products"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm hover:bg-emerald-600 sm:h-10 sm:w-10"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Segunda línea: sort + category + brand + reset */}
        <div className="mt-1 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Selectores */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
            {/* Sort */}
            <div className="sm:w-1/3">
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="h-9 w-full rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm sm:h-10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="sm:w-1/3">
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-9 w-full rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm sm:h-10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div className="sm:w-1/3">
              <Select value={brand} onValueChange={handleBrandChange}>
                <SelectTrigger className="h-9 w-full rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm sm:h-10">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent className="text-sm">
                  {BRAND_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Filters */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-full border-slate-200 bg-white px-3 text-xs font-medium whitespace-nowrap text-slate-600 hover:border-emerald-500 hover:text-emerald-600 sm:text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset filters</span>
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}
