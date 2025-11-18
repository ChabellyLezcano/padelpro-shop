// src/lib/cn.ts
import { clsx } from "clsx"

export function cn(...inputs: unknown[]) {
  return clsx(inputs)
}
