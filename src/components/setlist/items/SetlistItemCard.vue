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
import set = Reflect.set

const props = defineProps<{
  setlistItem: SetlistItem
}>()

const emit = defineEmits<{
  (e: 'updateSetlistItem', value: SetlistItem): void
  (e: 'selectSetlistItem', value: string): void
}>()

function formatLastRehearsal(date?: string) {
  if (!date) return 'Never rehearsed'

  const d = new Date(date)
  const now = new Date()

  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`

  return d.toLocaleDateString()
}

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
      <div class="text-xs text-gray-500 flex items-center gap-2">
        <span class="opacity-70">🎹</span>
        <span>{{ formatLastRehearsal(setlistItem.lastRehearsedAt) }}</span>
      </div>
    </template>
  </BaseCard>
</template>
