<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import type { Setlist } from '@/types/setlist.ts'
import { ref } from 'vue'
import type { SetlistItem } from '@/types/setlistItem.ts'
import {
  allSetlistItemStatuses,
  setlistItemStatusClasses,
  setlistItemStatusLabels,
} from '@/types/setlistItemStatus.ts'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const props = defineProps<{
  setlistItem: SetlistItem
}>()

const emit = defineEmits<{
  (e: 'updateSetlistItem', value: SetlistItem): void
  (e: 'selectSetlistItem', value: string): void
}>()

function onUpdateSetlistItemStatus(status: string) {
  emit('updateSetlistItem', <SetlistItem>{
    id: props.setlistItem.id,
    setlistId: props.setlistItem.setlistId,
    status,
  })
}
</script>
<template>
  <BaseCard clickable @click="$emit('selectSetlistItem', setlistItem.id)">
    <!-- body -->

    <template #meta>
      <div class="text-lg font-bold text-gray-900 leading-tight">
        {{ setlistItem.title ?? 'Tua mãe, aquela gorda' }}
      </div>
    </template>

    <StatusBadge
      v-if="setlistItem.status"
      :model-value="setlistItem.status"
      :statuses="allSetlistItemStatuses"
      :labels="setlistItemStatusLabels"
      :classes="setlistItemStatusClasses"
      @update:modelValue="onUpdateSetlistItemStatus"
    />

    <template #footer>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600"></div>
    </template>
  </BaseCard>
</template>
