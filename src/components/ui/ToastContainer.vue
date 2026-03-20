<script setup lang="ts">
import { useToast } from '@/composables/useToast.ts'

const { toasts, removeToast } = useToast()

function toastClass(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-600'
    case 'warning':
      return 'bg-yellow-500 text-black'
    case 'error':
      return 'bg-red-600'
    default:
      return 'bg-gray-800'
  }
}
</script>
<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="px-4 py-3 rounded-lg shadow text-white flex justify-between items-center"
      :class="toastClass(toast.type)"
    >
      <span class="text-sm">{{ toast.message }}</span>
      <button
        @click="removeToast(toast.id)"
        class="ml-3 text-white/70 hover:text-white">
          X
      </button>
    </div>
  </div>
</template>
