// src/components/ui/button.tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "outline" | "ghost"
type Size = "default" | "sm" | "md" | "lg" | "xl" | "icon"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium " +
    "transition focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-emerald-500 focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50"

  const variants: Record<Variant, string> = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    outline:
      "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
  }

  const sizes: Record<Size, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-sm",
    xl: "h-11 px-6 text-base",
    icon: "h-9 w-9 p-0 text-sm",
    default: "h-9 px-4 text-sm",
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}
