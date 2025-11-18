/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "class-variance-authority" {
  import { VariantProps } from "class-variance-authority/types"
  export function cva(...args: any[]): (...args: any[]) => string
  export type VariantProps<T> = T extends (...args: any[]) => any
    ? { [key: string]: any }
    : never
}
