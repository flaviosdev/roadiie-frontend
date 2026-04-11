<script setup lang="ts">
import SidePanel from '@/components/ui/SidePanel.vue'
import type { SetlistItem } from '@/types/setlistItem.ts'
import SetlistItemAnalysisPanel from '@/components/setlist/items/SetlistItemAnalysisPanel.vue'
import type { Page } from '@/types/page.ts'
import type { Setlist } from '@/types/setlist.ts'

defineProps<{
  show: boolean
  setlistItem: SetlistItem | null
  setlistPage: Page<Setlist> | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated', setlistItem: SetlistItem): void
  (e: 'rehearsed', setlistItem: SetlistItem): void
  (e: 'deleted', setlistItem: SetlistItem): void
}>()

function onUpdate(item: SetlistItem) {
  emit('updated', item)
}

function onRehearsed(item: SetlistItem) {
  emit('rehearsed', item)
}

function onDeleted(item: SetlistItem) {
  emit('deleted', item)
}
</script>
<template>
  <SidePanel :show="show" @close="$emit('close')">
    <SetlistItemAnalysisPanel
      v-if="setlistItem && setlistPage"
      :setlistItem="setlistItem"
      :setlistPage="setlistPage"
      @updated="onUpdate"
      @rehearsed="onRehearsed"
      @deleted="onDeleted"
    />
  </SidePanel>
</template>
