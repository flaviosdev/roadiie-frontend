<script setup lang="ts">
import type { Upload } from '@/types/upload.ts'
import { computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const props = defineProps<{ upload: Upload }>()

const platformIcon = computed(() => {
  switch (props.upload.platformId) {
    case 'youtube':
      return 'YT 📺'
    default:
      return 'UP ⬆️'
  }
})

const platformColor = computed(() => {
  switch (props.upload.platformId) {
    case 'youtube':
      return 'bg-red-600'
    default:
      return 'bg-blue-600'
  }
})

function formatDate(d: string | Date | undefined) {
  if (!d) return '-'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString()
}

function compactNumber(n: number): string {
  if (n < 1000) return n.toString()
  if (n < 1_000_000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k'
  return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M'
}
</script>

<template>
  <BaseCard clickable @click="$emit('select', upload.id)">
    <template #image>
      <div class="h-32 w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <img
          v-if="upload.videoId"
          :src="`https://i.ytimg.com/vi/${upload.videoId}/mqdefault.jpg`"
          class="h-full w-full object-cover rounded-lg"
        />
        <div v-else class="text-5xl opacity-40">
          {{ platformIcon }}
        </div>
      </div>
    </template>

    <template #meta>
      <div class="flex gap-3 text-gray-600 text-sm mt-2">
        <span>👁 {{ compactNumber(upload.summary?.totalViews) }}</span>
        <span>👍 {{ compactNumber(upload.summary?.totalLikes) }}</span>
        <span>💬 {{ compactNumber(upload.summary?.totalComments) }}</span>
        <span>{{ upload.songId ? '🎶' : '' }}</span>
      </div>
    </template>

    <div class="font-semibold text-gray-900 line-clamp-2">
      {{ upload.title }}
    </div>

    <template #footer>
      <div class="text-sm text-gray-500 flex justify-between">
        <span class="px-2 py-0.5 rounded-lg text-white text-xs" :class="platformColor">
          {{ upload.platformId }}
        </span>
        <span>{{ formatDate(upload.uploadedAt) }}</span>
      </div>
    </template>
  </BaseCard>

</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
