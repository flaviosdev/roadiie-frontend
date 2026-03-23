<script setup lang="ts">
import type { Upload } from '@/types/upload'
import { useUploadMetricsApi } from '@/composables/useUploadMetricsApi.ts'
import { onMounted, onUnmounted } from 'vue'
import UploadTimelineTab from '@/components/upload/tabs/timeline/UploadTimelineTab.vue'

const props = defineProps<{
  upload: Upload
}>()

onMounted(()=> console.log(props.upload.summary))
</script>

<template>
  <div class="space-y-6">
    <div class="text-sm text-gray-500">Overview</div>

    <!-- Thumbnail + KPIs -->
    <div class="flex flex-col md:flex-row gap-4">
      <img
        v-if="upload.videoId"
        :src="`https://i.ytimg.com/vi/${upload.videoId}/mqdefault.jpg`"
        class="w-full md:w-40 h-auto md:h-24"
      />

      <div class="grid grid-cols-1 md:grid:cols-2 gap-3 flex-1">
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
      </div>
    </div>

    <UploadTimelineTab :upload="upload" />
  </div>
</template>
