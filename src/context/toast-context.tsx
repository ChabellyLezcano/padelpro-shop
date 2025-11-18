"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

type Toast = {
  id: number
  title: string
  description?: string
}

type ShowToastOptions = {
  title: string
  description?: string
}

type ToastContextValue = {
  showToast: (options: ShowToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((options: ShowToastOptions) => {
    const id = Date.now()

    setToasts((prev) => [
      ...prev,
      {
        id,
        title: options.title,
        description: options.description,
      },
    ])

    // Auto cerrar a los 3s
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const handleClose = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Contenedor de toasts */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="mt-1 text-xs text-slate-500">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleClose(toast.id)}
                className="ml-1 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "⚠️ useToast usado fuera de ToastProvider. No se mostrará ningún toast."
      )
    }
    return {
      showToast: () => {},
    }
  }
  return ctx
}
