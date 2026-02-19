import { ref } from 'vue'

export const globalError = ref<string | null>(null)

export function setGlobalError(msg: string) {
  globalError.value = msg

  setTimeout(() => {
    globalError.value = null
  }, 4000)
}
