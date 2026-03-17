<script setup lang="ts">
import SidePanel from '@/components/ui/SidePanel.vue'
import type { SetlistItem } from '@/types/setlistItem.ts'
import SetlistItemAnalysisPanel from '@/components/setlist/items/SetlistItemAnalysisPanel.vue'

defineProps<{
  show: boolean
  setlistItem: SetlistItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated', setlistItem: SetlistItem): void
}>()

function onUpdate(item: SetlistItem) {
  emit('updated', item)
}

</script>
<template>
  <SidePanel :show="show" @close="$emit('close')">
    <SetlistItemAnalysisPanel
      v-if="setlistItem"
      :setlistItem="setlistItem"
      @updated="onUpdate"
    />
  </SidePanel>
</template>
