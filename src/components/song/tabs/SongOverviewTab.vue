<script setup lang="ts">
import { computed } from 'vue'
import type { Song } from '@/types/song'

const props = defineProps<{
  song: Song
}>()

// 🔥 MOCK – depois vem da performance real
const totalUploads = 7
const totalViews = 34200
const averageViews = Math.round(totalViews / totalUploads)

const performanceBadge = computed(() => {
  if (totalViews > 30000) return { label: 'High Performer', color: 'bg-green-100 text-green-700' }
  if (totalViews > 10000) return { label: 'Normal', color: 'bg-yellow-100 text-yellow-700' }
  return { label: 'Low Performer', color: 'bg-red-100 text-red-700' }
})
</script>

<template>
  <div class="space-y-6">

    <!-- Performance Summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div class="bg-gray-50 p-4 rounded border">
        <div class="text-xs text-gray-500">Total Uploads</div>
        <div class="text-xl font-semibold">{{ totalUploads }}</div>
      </div>

      <div class="bg-gray-50 p-4 rounded border">
        <div class="text-xs text-gray-500">Total Views</div>
        <div class="text-xl font-semibold">
          {{ totalViews.toLocaleString() }}
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded border">
        <div class="text-xs text-gray-500">Average Views</div>
        <div class="text-xl font-semibold">
          {{ averageViews.toLocaleString() }}
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded border">
        <div class="text-xs text-gray-500">Rank</div>
        <div class="text-xl font-semibold">3rd in repertoire</div>
      </div>

    </div>

    <!-- Strategic Classification -->
    <div class="flex items-center justify-between bg-white border rounded p-4">

      <div>
        <div class="text-sm text-gray-500">Strategic Position</div>
        <div class="text-lg font-semibold">
          {{ performanceBadge.label }}
        </div>
      </div>

      <div
        class="px-3 py-1 rounded text-sm font-medium"
        :class="performanceBadge.color"
      >
        {{ performanceBadge.label }}
      </div>

    </div>

    <!-- Song Information -->
    <div class="bg-white border rounded p-4 space-y-3">

      <div class="text-sm font-medium text-gray-700">
        Song Information
      </div>

      <div class="grid grid-cols-2 gap-y-2 text-sm">

        <div class="text-gray-500">Artist</div>
        <div>{{ song.artist }}</div>

        <div class="text-gray-500">Release Year</div>
        <div>{{ song.releaseYear }}</div>

        <div class="text-gray-500">Genre</div>
        <div>{{ song.genre }}</div>

        <div class="text-gray-500">Status</div>
        <div>{{ song.status }}</div>

      </div>

    </div>

    <!-- Tags -->
    <div v-if="song.tags?.length" class="bg-white border rounded p-4">
      <div class="text-sm font-medium text-gray-700 mb-3">
        Tags
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in song.tags"
          :key="tag"
          class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
        >
          {{ tag }}
        </span>
      </div>
    </div>

  </div>
</template>
