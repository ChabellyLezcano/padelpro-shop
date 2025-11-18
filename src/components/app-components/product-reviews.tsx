// src/components/app-components/product-reviews.tsx
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Review } from "@/types/review"

type ProductReviewsProps = {
  reviews: Review[]
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function formatReviewDate(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ""

  const day = String(d.getUTCDate()).padStart(2, "0")
  const month = MONTHS_SHORT[d.getUTCMonth()]
  const year = d.getUTCFullYear()

  // Example: 08 Sep 2025
  return `${day} ${month} ${year}`
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <Card className="border-slate-200 bg-white">
        <CardContent className="p-4 sm:p-5">
          <p className="text-sm text-slate-500">
            There are no reviews for this product yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {reviews.map((review) => {
          const rating = review.rating ?? 0

          return (
            <Card
              key={review.id}
              className="rounded-2xl border-slate-200 bg-white/90"
            >
              <CardContent className="space-y-2 p-4 sm:p-5">
                {/* Rating + date */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-700">
                      {rating.toFixed(1)}/5
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {formatReviewDate(review.created_at)}
                  </p>
                </div>

                {/* Title */}
                {review.title && (
                  <h3 className="text-sm font-semibold text-slate-900">
                    {review.title}
                  </h3>
                )}

                {/* Comment */}
                {review.comment && (
                  <p className="text-sm leading-relaxed text-slate-700">
                    {review.comment}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
