import { ref } from 'vue'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

type Toast = {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])
let id = 0

function addToast(message: string, type: ToastType = 'info', duration = 3000) {
  const toastId = id++

  toasts.value.push({
    id: toastId,
    message,
    type,
  })

  setTimeout(() => {
    removeToast(toastId)
  }, duration)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

export function useToast() {
  return {
    toasts,
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
    warning: (msg: string) => addToast(msg, 'warning'),
    removeToast,
  }
}
