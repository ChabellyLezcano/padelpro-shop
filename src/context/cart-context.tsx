"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react"

type CartItem = {
  id: string
  name: string
  slug: string
  price: number
  image_url: string | null
  quantity: number
}

type CartState = {
  items: CartItem[]
}

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

type CartAction =
  | {
      type: "ADD_ITEM"
      payload: { item: Omit<CartItem, "quantity">; quantity: number }
    }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartState }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload
      const existing = state.items.find((i) => i.id === item.id)

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        }
      }

      return {
        items: [
          ...state.items,
          {
            ...item,
            quantity,
          },
        ],
      }
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.id !== action.payload.id),
      }

    case "CLEAR":
      return { items: [] }

    case "HYDRATE":
      return action.payload

    default:
      return state
  }
}

const STORAGE_KEY = "padelpro-cart-v1"

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartState
        dispatch({ type: "HYDRATE", payload: parsed })
      }
    } catch (err) {
      console.error("Error hydrating cart from storage", err)
    }
  }, [])

  // 💾 Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (err) {
      console.error("Error saving cart to storage", err)
    }
  }, [state])

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { item, quantity } })
  }

  const removeItem: CartContextValue["removeItem"] = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR" })
  }

  const count = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const total = state.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )

  const value: CartContextValue = {
    items: state.items,
    count,
    total,
    addItem,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)

  if (!ctx) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "⚠️ useCart was used outside of CartProvider. Returning empty cart."
      )
    }

    return {
      items: [],
      count: 0,
      total: 0,
      addItem: () => {},
      removeItem: () => {},
      clearCart: () => {},
    }
  }

  return ctx
}
