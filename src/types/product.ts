import type { Review } from "./review"

export type ProductDiscount = {
  discount_type: "percentage" | "fixed"
  discount_value: number
  is_active?: boolean
  starts_at?: string | null
  ends_at?: string | null
}

export type ProductAttributes = Record<string, unknown>

export type ProductCardBase = {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image_url: string | null
  product_discounts?: ProductDiscount[] | null
}

export type Product = ProductCardBase & {
  description: string | null
  brand_id: string | null
  category_id: string | null
  attributes?: ProductAttributes | null
  brands?: {
    name: string
  } | null
  categories?: {
    name: string
    slug: string
  } | null
  product_reviews?: Review[] | null
}

export type RelatedProduct = ProductCardBase
