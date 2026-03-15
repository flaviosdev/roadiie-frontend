<template>
  <div class="space-y-6">
    <div class="text-sm text-gray-500">
      Manage practice progress and personal notes for this song.
    </div>

    <!-- Basic Info -->
    <div class="bg-gray-50 p-4 rounded space-y-2">
      <div>
        <div class="text-xs text-gray-500">Title</div>
        <div class="font-semibold text-lg">
          {{ editableItem.title || 'Untitled song' }}
        </div>
      </div>

      <div>
        <div class="text-xs text-gray-500">Status</div>
        <div class="font-medium">
          {{ editableItem.status || 'BACKLOG' }}
        </div>
      </div>

      <div v-if="editableItem.lastRehearsedAt">
        <div class="text-xs text-gray-500">Last Rehearsed</div>
        <div class="font-medium">
          {{ formatDate(editableItem.lastRehearsedAt) }}
        </div>
      </div>
    </div>

    <!-- Rehearsal action -->
    <div class="flex items-center gap-3">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        @click="registerRehearsal"
      >
        Register rehearsal
      </button>

      <span v-if="editableItem.lastRehearsedAt" class="text-sm text-gray-500">
        Last rehearsal: {{ formatDate(editableItem.lastRehearsedAt) }}
      </span>
    </div>

    <!-- Notes -->
    <div class="space-y-2">
      <label class="text-sm font-medium">Notes</label>

      <textarea
        v-model="editableItem.userNote"
        rows="5"
        class="w-full border rounded p-2 text-sm"
        placeholder="Write practice notes, reminders, ideas..."
      />

      <div class="flex justify-end">
        <button
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          @click="saveNotes"
        >
          Save notes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SetlistItem } from '@/types/setlistItem'
import { ref, watch } from 'vue'

const props = defineProps<{
  setlistItem: SetlistItem
}>()

const emit = defineEmits<{
  (e: 'updated', item: SetlistItem): void
  (e: 'rehearsed', item: SetlistItem): void
}>()

const editableItem = ref<SetlistItem>({ ...props.setlistItem })

watch(
  () => props.setlistItem,
  (newItem) => {
    editableItem.value = { ...newItem }
  },
)

function registerRehearsal() {
  editableItem.value.lastRehearsedAt = new Date().toISOString()

  emit('rehearsed', editableItem.value)
}

function saveNotes() {
  emit('updated', editableItem.value)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}
</script>
