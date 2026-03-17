<script setup lang="ts">
import type { SetlistItem } from '@/types/setlistItem.ts'
import { ref } from 'vue'
import SetlistItemsDetailsTab from '@/components/setlist/items/tabs/SetlistItemsDetailsTab.vue'

const props = defineProps<{
  setlistItem: SetlistItem
}>()

const emit = defineEmits<{
  (e: 'updated', item: SetlistItem): void
}>()

type TabKey = 'details'

const activeTab = ref<TabKey>('details')

function onUpdated(item: SetlistItem) {
  emit('updated', item)
}

function onRehearsed(item: SetlistItem) {
  emit('updated', item)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="border-b pb-3 mb-4">
      <h2 class="text-lg font-semibold line-clamp-2">
        {{ setlistItem.title }}
      </h2>
      <div class="text-sm text-gray-500">BLABLABLA</div>
    </div>

    <div class="flex gap-2 border-b mb-4">
      <button
        v-for="tab in [{ key: 'details', label: 'Details' }]"
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
      <SetlistItemsDetailsTab
        v-if="activeTab === 'details'"
        :setlistItem="setlistItem"
        @rehearsed="onRehearsed"
        @updated="onUpdated"
      />
    </div>
  </div>
</template>
