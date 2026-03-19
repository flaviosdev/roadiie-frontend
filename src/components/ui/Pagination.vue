<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  (e: 'change', page: number): void
}>()
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
    <div class="text-sm text-gray-500">Página {{ currentPage + 1 }} de {{ totalPages }}</div>

    <div class="flex gap-2">
      <button
        :disabled="currentPage === 0"
        @click="$emit('change', currentPage - 1)"
        class="px-3 py-1 rounded border disabled:opacity-50"
      >
        Anterior
      </button>

      <button
        :disabled="currentPage >= totalPages - 1"
        @click="$emit('change', currentPage + 1)"
        class="px-3 py-1 rounded border disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  </div>
</template>
