<script setup lang="ts">
import type { SetlistItem } from '@/types/setlistItem'
import { ref, watch, computed, onUnmounted } from 'vue'
import type { Page } from '@/types/page.ts'
import type { Setlist } from '@/types/setlist.ts'

const props = defineProps<{
  setlistItem: SetlistItem
  setlistPage: Page<Setlist>
}>()

const emit = defineEmits<{
  (e: 'updated', item: SetlistItem): void
  (e: 'rehearsed', item: SetlistItem): void
  (e: 'deleted', item: SetlistItem): void
}>()

const editableItem = ref<SetlistItem>({ ...props.setlistItem })
const originalItem = ref<SetlistItem>({ ...props.setlistItem })

const isDirty = ref(false)
const isSaving = ref(false)
const isConfirmingDelete = ref(false)
let deleteTimeout: ReturnType<typeof setTimeout> | null = null

const daysSinceLastRehearsal = computed(() => {
  if (!editableItem.value.lastRehearsedAt) return null

  const last = new Date(editableItem.value.lastRehearsedAt)
  const now = new Date()

  const startOfDay = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())

  return Math.floor(
    (startOfDay(now).getTime() - startOfDay(last).getTime()) / (1000 * 60 * 60 * 24),
  )
})

watch(
  () => props.setlistItem,
  (newItem) => {
    editableItem.value = { ...newItem }
    originalItem.value = { ...newItem }
    isDirty.value = false
  },
)

watch(
  editableItem,
  () => {
    isDirty.value = JSON.stringify(editableItem.value) !== JSON.stringify(originalItem.value)
  },
  { deep: true },
)

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

function deleteItem() {
  if (isConfirmingDelete.value) {
    emit('deleted', editableItem.value)
    resetDeleteState()
    return
  }

  isConfirmingDelete.value = true

  deleteTimeout = setTimeout(() => {
    resetDeleteState()
  }, 3000)
}

function resetDeleteState() {
  isConfirmingDelete.value = false

  if (deleteTimeout) {
    clearTimeout(deleteTimeout)
    deleteTimeout = null
  }
}

function getDotClass(index: number) {
  if (index === 0) return 'bg-blue-600'
  if (index < 3) return 'bg-blue-400'
  return 'bg-gray-300'
}

onUnmounted(() => {
  if (deleteTimeout) {
    clearTimeout(deleteTimeout)
  }
})

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
  <div class="space-y-2">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-xl font-semibold">
          {{ editableItem.title || 'Untitled song' }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ editableItem.status || 'BACKLOG' }}
        </p>
      </div>

      <span v-if="isDirty" class="text-xs text-yellow-600"> Unsaved changes </span>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Setlist</label>

      <select v-model="editableItem.setlistId" class="w-full border rounded p-2 text-sm">
        <option disabled value="">Select a setlist</option>

        <option v-for="setlist in setlistPage?.content" :key="setlist.id" :value="setlist.id">
          {{ setlist.title }}
        </option>
      </select>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Setlist Order</label>

      <div class="flex items-center gap-2">
        <button @click="editableItem.order = Math.max(1, (editableItem.order || 1) - 1)">-</button>

        <input
          v-model.number="editableItem.order"
          type="number"
          class="w-20 text-center border rounded p-2"
        />

        <button @click="editableItem.order = (editableItem.order || 0) + 1">+</button>
      </div>

      <p class="text-xs text-gray-500">Lower numbers appear first</p>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Rehearsal</label>

      <div class="flex items-center gap-3">
        <button class="px-3 py-1.5 bg-blue-600 text-white rounded" @click="registerRehearsal">
          Register
        </button>

        <span v-if="editableItem.lastRehearsedAt" class="text-xs text-gray-500">
          {{ formatDate(editableItem.lastRehearsedAt) }}
          • {{ daysSinceLastRehearsal === 0 ? 'today' : `${daysSinceLastRehearsal}d ago` }}
        </span>
      </div>
      <div class="flex gap-1">
        <div
          v-for="date in [...(editableItem.rehearses || [])].slice(-7).reverse()"
          :key="date"
          class="w-2 h-2 rounded-full bg-blue-500"
        />
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-medium">Notes</label>

      <textarea
        v-model="editableItem.userNote"
        rows="5"
        class="w-full border rounded p-2 text-sm"
      />
    </div>

    <div class="flex justify-between items-center pt-4 border-t">
      <button
        @click="deleteItem"
        class="px-4 py-2 rounded text-sm transition"
        :class="
          isConfirmingDelete
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'text-red-600 hover:underline'
        "
      >
        {{ isConfirmingDelete ? 'U SURE?' : 'Delete' }}
      </button>

      <div class="flex gap-2">
        <button
          :disabled="!isDirty"
          @click="cancelChanges"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          :disabled="!isDirty || isSaving"
          @click="saveAll"
          class="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>
