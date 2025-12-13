<script setup lang="ts">
import { ref } from 'vue'
import type { Upload } from '@/types/upload.ts'
import UploadOverviewTab from '@/components/upload/tabs/UploadOverviewTab.vue'
import UploadTimelineTab from '@/components/upload/tabs/UploadTimelineTab.vue'
import UploadDetailsTab from '@/components/upload/tabs/UploadDetailsTab.vue'
import UploadToolsTab from '@/components/upload/tabs/UploadToolsTab.vue'

const props = defineProps<{
  upload: Upload
}>()

type TabKey = 'overview' | 'timeline' | 'details' | 'tools'

const activeTab = ref<TabKey>('overview')
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="border-b pb-3 mb-4">
      <h2 class="text-lg font-semibold line-clamp-2">
        {{ upload.title }}
      </h2>
      <div class="text-sm text-gray-500">
        {{ upload.platformId }} · {{ new Date(upload.uploadedAt).toLocaleString() }}
      </div>
    </div>

    <div class="flex gap-2 border-b mb-4">
      <button
        v-for="tab in [
          { key: 'overview', label: 'Overview' },
          { key: 'timeline', label: 'Timeline' },
          { key: 'details', label: 'Details' },
          { key: 'tools', label: 'Tools' },
        ]"
        :key="tab.key"
        @click="activeTab = tab.key as TabKey"
        class="px-3 py-1.5 text-sm rounded-t"
        :class="
          activeTab === tab.key
            ? 'bg-white border border-b-0 font-medium'
            : 'text-gray-500 hover:text-gray-700'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto">

      <UploadOverviewTab v-if="activeTab === 'overview'" :upload="upload" />

      <UploadTimelineTab v-if="activeTab === 'timeline'" :upload="upload" />

      <UploadDetailsTab
        v-if="activeTab === 'details'"
        :upload="upload"
        @updated="$emit('updated', $event)"
      />

      <UploadToolsTab v-if="activeTab === 'tools'" :upload="upload" />

    </div>
  </div>
</template>
