<script setup lang="ts">
import type { Upload } from '@/types/upload'

const props = defineProps<{
  upload: Upload
}>()
</script>

<template>
  <div class="space-y-6">

    <div class="text-sm text-gray-500">Overview</div>

    <!-- Thumbnail + KPIs -->
    <div class="flex gap-4">
      <img
        v-if="upload.videoId"
        :src="`https://i.ytimg.com/vi/${upload.videoId}/mqdefault.jpg`"
        class="w-40 h-24 rounded-lg object-cover"
      />

      <div class="grid grid-cols-2 gap-3 flex-1">
        <div class="bg-gray-50 p-3 rounded">
          <div class="text-xs text-gray-500">Views</div>
          <div class="text-lg font-semibold">
            {{ upload.summary.totalViews }}
          </div>
        </div>

        <div class="bg-gray-50 p-3 rounded">
          <div class="text-xs text-gray-500">Likes</div>
          <div class="text-lg font-semibold">
            {{ upload.summary.totalLikes }}
          </div>
        </div>

        <div class="bg-gray-50 p-3 rounded">
          <div class="text-xs text-gray-500">Comments</div>
          <div class="text-lg font-semibold">
            {{ upload.summary.totalComments }}
          </div>
        </div>

        <div class="bg-gray-50 p-3 rounded">
          <div class="text-xs text-gray-500">Score</div>
          <div class="text-lg font-semibold">
            {{ upload.summary.score }}
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder for insights -->
    <div class="bg-blue-50 border border-blue-200 p-4 rounded">
      <div class="text-sm font-medium text-blue-800">
        Insights
      </div>
      <p class="text-sm text-blue-700 mt-1">
        Performance summary and trends will appear here.
      </p>
    </div>

  </div>
</template>
