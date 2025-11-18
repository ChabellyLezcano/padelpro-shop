"use client"

import { useState } from "react"
import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Lock, ArrowLeft } from "lucide-react"

import { useCart } from "@/context/cart-context"
import { getProductImageUrl } from "@/lib/images"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckoutPaymentModal } from "@/components/app-components/checkout-payment-modal"

const SHIPPING_COST = 4.99

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()

  const [isPaying, setIsPaying] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [cardNumber, setCardNumber] = useState("")

  const hasItems = items.length > 0
  const isFormValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    cardNumber.trim().length > 0

  const grandTotal = total + SHIPPING_COST

  const handlePay = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!hasItems || isPaying || !isFormValid) return

    setIsPaying(true)
    setShowPaymentModal(true)

    setTimeout(() => {
      clearCart()
      router.push("/")
    }, 2000)
  }

  if (!hasItems) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Checkout
        </h1>
        <Card className="rounded-3xl border border-slate-200 bg-white">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-sm font-medium text-slate-800">
              Your cart is empty
            </p>
            <p className="text-xs text-slate-500">
              Add some padel products before proceeding to checkout.
            </p>
            <Link href="/" className="mt-2">
              <Button className="rounded-full bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700">
                Back to products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <section className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Checkout
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Review your order and enter your details to complete the
                purchase.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Step 2 of 2 · Payment</span>
            </div>
          </div>
        </section>

        {/* Layout */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Order resume */}
          <Card className="rounded-3xl border border-slate-200 bg-white">
            <CardContent className="flex flex-col gap-6 space-y-5 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold tracking-[0.16em] text-slate-500 uppercase">
                  Order summary
                </h2>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                  {items.length} item{items.length !== 1 && "s"}
                </span>
              </div>

              <ul className="space-y-3">
                {items.map((item) => {
                  const imageUrl = getProductImageUrl(item.image_url)
                  const unitPrice =
                    typeof item.price === "number" ? item.price : 0
                  const lineTotal = unitPrice * item.quantity

                  return (
                    <li
                      key={item.id}
                      className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                    >
                      {/* Product Image */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
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
                      <div className="flex flex-1 flex-col justify-between text-sm">
                        <div>
                          <p className="line-clamp-2 font-medium text-slate-900">
                            {item.name || "Product"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Qty:{" "}
                            <span className="font-semibold text-slate-800">
                              {item.quantity}
                            </span>
                          </p>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                          <span>
                            {unitPrice > 0
                              ? `€${unitPrice.toFixed(2)} each`
                              : "Price not available"}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">
                            €{lineTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <div className="border-0.5 border-t text-slate-50"></div>
              {/* Shippment sum */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>€{SHIPPING_COST.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>€{grandTotal.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Shipping cost is fixed for this demo checkout.
                </p>
              </div>
              <div className="text-md flex items-center justify-between pt-2 text-slate-500">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Continue shopping</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200 bg-white">
            <CardContent className="space-y-5 p-5 sm:p-6">
              <h2 className="text-sm font-semibold tracking-[0.16em] text-slate-500 uppercase">
                Payment details
              </h2>

              <form className="space-y-4" onSubmit={handlePay}>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">
                    Full name
                  </label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="Ada Lovelace"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700">
                    Card details (mock)
                  </label>
                  <input
                    required
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Secure demo checkout</span>
                  </div>
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
                    Card · Demo
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isPaying || !isFormValid}
                  className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors ${
                    isPaying || !isFormValid
                      ? "cursor-not-allowed bg-slate-200 text-slate-500"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {isPaying ? "Processing..." : `Pay €${grandTotal.toFixed(2)}`}
                </Button>

                <p className="text-center text-[11px] text-slate-400">
                  This is a demo checkout. No real payment will be processed.
                </p>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>

      <CheckoutPaymentModal open={showPaymentModal} total={grandTotal} />
    </>
  )
}
