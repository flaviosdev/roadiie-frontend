<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-bold text-lg">Uploads</h2>
      <div>
        <button
          class="px-2 py-1 rounded bg-blue-600 text-white"
          @click="$emit('create')"
        >
          + Novo Upload
        </button>
      </div>
    </div>

    <ul class="space-y-1">
      <li
        v-for="upload in uploadList"
        :key="upload.id"
        class="p-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center"
        :class="{'bg-gray-200': selectedId === upload.id}"
        @click="$emit('select', upload.id)"
      >
        <div>
          <div class="font-medium">{{ upload.title }}</div>
          <div class="text-sm text-gray-500">{{ upload.platform }} • {{ upload.platformId }}</div>
        </div>
        <div class="text-sm text-gray-400">{{ formatDate(upload.uploadedAt) }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Upload } from '@/types/upload'

const props = defineProps<{
  uploadList: Upload[]
  selectedId: string | null
}>()

const emit = defineEmits(['select', 'create', 'connect'])

function formatDate(d: string | Date | undefined) {
  if (!d) return '-'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString()
}
</script>
