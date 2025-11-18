// src/lib/images.ts
export function getProductImageUrl(imagePath: string | null) {
  if (!imagePath) return "/placeholder-product.png"

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_PRODUCTS_BASE_URL
  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_STORAGE_PRODUCTS_BASE_URL env var"
    )
  }

  return `${baseUrl}/${imagePath}`
}
