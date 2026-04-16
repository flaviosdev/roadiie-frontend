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

  // normaliza para meia-noite local
  const startOfDay = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())

  const diff = (startOfDay(now).getTime() - startOfDay(d).getTime()) / (1000 * 60 * 60 * 24)

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`

  return d.toLocaleDateString()
}

function hasNote(note?: string) {
  return note && note.trim().length > 0
}

function onUpdateSetlistItemStatus(status: string) {
  emit('updateSetlistItem', {
    ...props.setlistItem,
    status,
  })
}
</script>
<template>
  <BaseCard clickable @click="$emit('selectSetlistItem', setlistItem.id)">
    <!-- body -->

    <template #meta>
      <div class="flex gap-3 items-start">
        <!-- ORDER -->
        <div class="w-6 text-sm font-semibold text-gray-400 text-right pt-0.5">
          {{ setlistItem.order ?? '-' }}
        </div>

        <!-- CONTENT -->
        <div class="flex-1 space-y-1">
          <!-- Title -->
          <div class="text-lg font-bold text-gray-900 leading-tight">
            {{ setlistItem.title ?? 'Untitled song' }}
          </div>

          <!-- User note -->
          <div v-if="hasNote(setlistItem.userNote)" class="text-sm text-gray-500 line-clamp-2">
            {{ setlistItem.userNote }}
          </div>

          <div v-else class="text-sm text-gray-300 italic">No notes yet</div>
        </div>
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
