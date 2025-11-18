// src/lib/cart.ts
export type CartProduct = {
  id: string
  name: string
  slug: string
  price: number
  image_url: string | null
  product_discounts?:
    | {
        discount_type: "percentage" | "fixed"
        discount_value: number
        is_active?: boolean
        starts_at?: string | null
        ends_at?: string | null
      }[]
    | null
}

export type CartItemInput = {
  id: string
  name: string
  slug: string
  price: number
  image_url: string | null
  quantity: number
}

export function getCartPriceInfo(product: CartProduct) {
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

  return {
    hasDiscount,
    finalPrice,
    discountLabel,
  }
}

export function createCartItemFromProduct(
  product: CartProduct,
  quantity: number = 1
): CartItemInput {
  const { finalPrice } = getCartPriceInfo(product)

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: finalPrice,
    image_url: product.image_url,
    quantity,
  }
}

export function addProductToCart(
  addItem: (item: CartItemInput) => void,
  product: CartProduct,
  quantity: number = 1
) {
  const cartItem = createCartItemFromProduct(product, quantity)
  addItem(cartItem)
}
