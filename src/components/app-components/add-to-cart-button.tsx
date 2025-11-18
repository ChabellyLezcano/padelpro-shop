// src/components/app-components/add-to-cart-button.tsx
"use client"

import { useState } from "react"
import { ShoppingCart, Check, Bell } from "lucide-react"
import { toast } from "sonner"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"

type AddToCartButtonProps = {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image_url: string | null
  }
  quantity?: number
  className?: string
  iconOnly?: boolean
  /**
   * "add" → add to cart (default)
   * "notify" → notify me (no add to cart)
   */
  variant?: "add" | "notify"
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  iconOnly = false,
  variant = "add",
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClick = () => {
    if (isProcessing) return

    setIsProcessing(true)

    if (variant === "add") {
      // Add to cart
      addItem(
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image_url: product.image_url,
        },
        quantity
      )

      toast.success("Added to cart", {
        description: product.name || "Product",
        duration: 1200,
      })
    } else {
      // Notify me (no cart mutation)
      toast("We’ll notify you", {
        description: "When this product is back in stock.",
        duration: 1500,
        className:
          "bg-slate-900 text-slate-200 border border-slate-700 text-sm",
      })
    }

    setTimeout(() => setIsProcessing(false), 400)
  }

  const baseClasses =
    "inline-flex items-center justify-center rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"

  const withTextClasses = "gap-2 px-6 py-2"
  const iconOnlyClasses = "h-10 w-10 p-0"

  const variantClasses =
    variant === "add"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : "bg-slate-700 text-slate-50 hover:bg-slate-800"

  // Content depending on variant + state
  const content = (() => {
    if (iconOnly) {
      if (isProcessing) {
        return <Check className="h-5 w-5 text-white" aria-hidden="true" />
      }

      if (variant === "add") {
        return (
          <ShoppingCart className="h-5 w-5 text-white" aria-hidden="true" />
        )
      }

      // variant === "notify"
      return <Bell className="h-5 w-5 text-white" aria-hidden="true" />
    }

    // With text
    if (variant === "add") {
      return isProcessing ? (
        <>
          <Check className="h-4 w-4 text-white" aria-hidden="true" />
          <span>Added</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 text-white" aria-hidden="true" />
          <span>Add to cart</span>
        </>
      )
    }

    // variant === "notify"
    return isProcessing ? (
      <>
        <Check className="h-4 w-4 text-white" aria-hidden="true" />
        <span>Saved</span>
      </>
    ) : (
      <>
        <Bell className="h-4 w-4 text-white" aria-hidden="true" />
        <span>Notify me</span>
      </>
    )
  })()

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isProcessing}
      aria-label={
        iconOnly ? (variant === "add" ? "Add to cart" : "Notify me") : undefined
      }
      className={[
        baseClasses,
        iconOnly ? iconOnlyClasses : withTextClasses,
        variantClasses,
        "disabled:cursor-not-allowed disabled:opacity-70",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {content}
    </Button>
  )
}
