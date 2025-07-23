"use client"

// Dit is de standaard shadcn/ui useToast hook.
// Als je deze al hebt, hoef je niets te doen.
// Anders, voeg deze toe.
import * as React from "react"

import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 10000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST
      toast: ToasterToast
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST
      toast: Partial<ToasterToast>
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST
      toastId?: ToasterToast["id"]
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // ! Side effects ! - This means all toasts will be dismissed.
      // If you want to dismiss a single toast, you can do something like this:
      // `return { ...state, toasts: state.toasts.filter((toast) => toast.id !== toastId) }`
      return {
        ...state,
        toasts: state.toasts.map((toast) => (toast.id === toastId ? { ...toast, open: false } : toast)),
      }
    }
    case actionTypes.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const ToastContext = React.createContext<
  | {
      toast: ({ ...props }: ToastProps) => { id: string }
      dismiss: (toastId?: string) => void
      toasts: ToasterToast[]
    }
  | undefined
>(undefined)

const ToastContextProvider = ToastContext.Provider

function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] })

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
  }, [])

  const addToast = React.useCallback(
    ({ ...props }: ToastProps) => {
      const id = genId()

      const update = (props: Partial<ToasterToast>) =>
        dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } })
      const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

      dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss()
          },
          ...props,
        },
      })

      return {
        id: id,
        update,
        dismiss,
      }
    },
    [dispatch],
  )

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open === false) {
        // We need to remove dismissed toasts after a timeout
        // to allow animations to finish.
        setTimeout(() => {
          dispatch({ type: actionTypes.REMOVE_TOAST, toastId: toast.id })
        }, TOAST_REMOVE_DELAY)
      }
    })
  }, [state.toasts])

  const providerValue = React.useMemo(
    () => ({ toast: addToast, dismiss, toasts: state.toasts }),
    [addToast, dismiss, state.toasts],
  )

  return <ToastContextProvider value={providerValue}>{children}</ToastContextProvider>
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToasterProvider")
  }

  return context
}

export { ToasterProvider }
