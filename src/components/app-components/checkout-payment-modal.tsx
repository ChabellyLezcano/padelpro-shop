"use client"

import { useEffect, useState } from "react"
import { Lock, Check } from "lucide-react"

type CheckoutPaymentModalProps = {
  open: boolean
  total: number
}

export function CheckoutPaymentModal({
  open,
  total,
}: CheckoutPaymentModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSuccess(false)
      return
    }

    setShowSuccess(false)
    const timer = setTimeout(() => {
      setShowSuccess(true)
    }, 1200)

    return () => clearTimeout(timer)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60">
      <div className="w-[80%] max-w-md rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-xl sm:max-w-lg sm:px-8 sm:py-10 lg:w-1/3 lg:max-w-none">
        <div className="flex flex-col items-center gap-6">
          {/* Icono */}
          <div className="flex flex-col items-center gap-3">
            {!showSuccess ? (
              <>
                {/* Spinner */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <div className="flex h-14 w-14 animate-spin items-center justify-center rounded-full border-2 border-emerald-500 border-t-transparent">
                    <Lock className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs font-medium tracking-[0.16em] text-emerald-600 uppercase">
                  Secure payment
                </p>
              </>
            ) : (
              <>
                {/* Chack */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 shadow-md">
                    <Check className="h-8 w-8 text-white" strokeWidth={2.4} />
                  </div>
                </div>
                <p className="text-xs font-medium tracking-[0.16em] text-emerald-600 uppercase">
                  Payment confirmed
                </p>
              </>
            )}
          </div>

          {/* Texts */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              {showSuccess ? "Payment successful" : "Processing your payment"}
            </h2>

            {!showSuccess ? (
              <p className="text-sm text-slate-600 sm:text-base">
                We&apos;re securely charging your card for{" "}
                <span className="font-semibold text-slate-900">
                  €{total.toFixed(2)}
                </span>
                .
              </p>
            ) : (
              <p className="text-sm text-slate-600 sm:text-base">
                Your card has been charged for{" "}
                <span className="font-semibold text-slate-900">
                  €{total.toFixed(2)}
                </span>
                . Your order is being prepared.
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900 sm:text-base">
              Thank you for your purchase!
            </p>
            <p className="text-xs text-slate-400 sm:text-sm">
              You&apos;ll be redirected back to the store in a moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
