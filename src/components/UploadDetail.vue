<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold"> {{ upload.title }}</h1>

    <p><strong>ID:</strong> {{ upload.id }}</p>
    <p><strong>Cliente:</strong> {{ upload.clientId }}</p>
    <p><strong>Music ID:</strong> {{ upload.musicId }}</p>
    <p><strong>Plataforma:</strong> {{ upload.platform }} ({{ upload.platformId }})</p>
    <p><strong>Upload URL:</strong> <a :href="upload.uploadUrl" target="_blank" class="text-blue-600 underline">{{ upload.uploadUrl }}</a></p>
    <p><strong>Tipo:</strong> {{ upload.uploadType }}</p>
    <p><strong>Upload em:</strong> {{ formatDate(upload.uploadedAt) }}</p>

    <div class="flex gap-2">
      <button class="px-3 py-1 bg-yellow-600 text-white rounded" @click="$emit('edit', upload)">Editar</button>
      <button class="px-3 py-1 bg-red-600 text-white rounded" @click="$emit('delete', upload.id)">Deletar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Upload } from '@/types/upload'

const props = defineProps<{ upload: Upload }>()

function formatDate(d: string | Date | undefined) {
  if (!d) return '-'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString()
}
</script>
