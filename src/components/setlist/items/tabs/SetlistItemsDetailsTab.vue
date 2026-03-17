<script setup lang="ts">
import type { SetlistItem } from '@/types/setlistItem'
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  setlistItem: SetlistItem
}>()

const emit = defineEmits<{
  (e: 'updated', item: SetlistItem): void
  (e: 'rehearsed', item: SetlistItem): void
}>()

/**
 * Internal state
 */
const editableItem = ref<SetlistItem>({ ...props.setlistItem })
const originalItem = ref<SetlistItem>({ ...props.setlistItem })

const isDirty = ref(false)
const isSaving = ref(false)

/**
 * Sync when prop changes
 */
watch(
  () => props.setlistItem,
  (newItem) => {
    editableItem.value = { ...newItem }
    originalItem.value = { ...newItem }
    isDirty.value = false
  },
)

/**
 * Dirty tracking (deep)
 */
watch(
  editableItem,
  () => {
    isDirty.value = JSON.stringify(editableItem.value) !== JSON.stringify(originalItem.value)
  },
  { deep: true },
)

/**
 * Actions
 */
async function saveAll() {
  if (!isDirty.value) return

  isSaving.value = true
  try {
    emit('updated', editableItem.value)
    originalItem.value = { ...editableItem.value }
    isDirty.value = false
  } finally {
    isSaving.value = false
  }
}

function cancelChanges() {
  editableItem.value = { ...originalItem.value }
  isDirty.value = false
}

function registerRehearsal() {
  const updated = {
    ...editableItem.value,
    lastRehearsedAt: new Date().toISOString(),
  }

  editableItem.value = updated
  emit('rehearsed', updated)
}

/**
 * Helpers
 */
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}

const hasOrder = computed(() => editableItem.value.order != null)
</script>

<template>
  <div class="space-y-6">
    <!-- Info -->
    <div class="text-sm text-gray-500">
      Manage practice progress and personal notes for this song.
    </div>

    <!-- Basic Info -->
    <div class="bg-gray-50 p-4 rounded space-y-4">
      <span v-if="isDirty" class="text-xs text-yellow-600"> You have unsaved changes </span>
      <!-- Title -->
      <div>
        <div class="text-xs text-gray-500">Title</div>
        <div class="font-semibold text-lg">
          {{ editableItem.title || 'Untitled song' }}
        </div>
      </div>

      <!-- Status -->
      <div>
        <div class="text-xs text-gray-500">Status</div>
        <div class="font-medium">
          {{ editableItem.status || 'BACKLOG' }}
        </div>
      </div>

      <!-- Last rehearsal -->
      <div v-if="editableItem.lastRehearsedAt">
        <div class="text-xs text-gray-500">Last Rehearsed</div>
        <div class="font-medium">
          {{ formatDate(editableItem.lastRehearsedAt) }}
        </div>
      </div>

      <!-- ORDER (UX melhorado) -->
      <div>
        <div class="text-xs text-gray-500">Setlist Order</div>

        <div class="flex items-center gap-2 mt-1">
          <button
            class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            @click="editableItem.order = Math.max(1, (editableItem.order || 1) - 1)"
          >
            -
          </button>

          <input
            v-model.number="editableItem.order"
            type="number"
            min="1"
            class="w-20 text-center border rounded p-2"
            placeholder="-"
          />

          <button
            class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            @click="editableItem.order = (editableItem.order || 0) + 1"
          >
            +
          </button>
        </div>

        <p class="text-xs text-gray-500 mt-1">Lower numbers appear first in the setlist</p>
      </div>
    </div>

    <!-- Rehearsal -->
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
    </div>

    <!-- GLOBAL ACTION BAR -->
    <div class="flex justify-end gap-2 pt-4 border-t">
      <button
        class="px-4 py-2 rounded transition"
        :class="
          isDirty ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        "
        :disabled="!isDirty"
        @click="cancelChanges"
      >
        Cancel
      </button>

      <button
        class="px-4 py-2 rounded text-white transition"
        :class="isDirty ? 'bg-green-600 hover:bg-green-700' : 'bg-green-300 cursor-not-allowed'"
        :disabled="!isDirty || isSaving"
        @click="saveAll"
      >
        {{ isSaving ? 'Saving...' : 'Save changes' }}
      </button>
    </div>
  </div>
</template>
