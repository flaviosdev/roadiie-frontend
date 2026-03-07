<script setup lang="ts">
import type { Song } from '@/types/song.ts'
import { ref, watch } from 'vue'
import { allStatuses, type SongStatus, statusClasses, statusLabels } from '@/types/songStatus.ts'
import BaseCard from '@/components/ui/BaseCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const props = defineProps<{
  song: Song
}>()

const emit = defineEmits<{
  (e: 'statusUpdated', value: Song): void
  (e: 'selectSong', value: string): void
  (e: 'editingStarted', value: string): void
  (e: 'editingFinished', value: string): void
}>()

const isEditingTags = ref(false)
const localTags = ref<string[]>([...(props.song.tags ?? [])])

const availableTags = [
  'APRENDER',
  'COLOCAR_NA_PLAYLIST',
  'ENSAIAR',
  'ESCREVER_PARTITURA',
  'GRAVAR_VIDEO_CURTO',
  'PREPARAR_ARRANJO',
]

watch(
  () => props.song.tags,
  (val) => {
    localTags.value = [...(val ?? [])]
  },
)

watch(
  () => props.song.status,
  (val) => (localStatus.value = val),
)

const localStatus = ref(props.song.status)

function onUpdateSongStatus(status: string) {
  emit('statusUpdated', <Song>{
    id: props.song.id,
    status,
  })
}

function toggleTag(tag: string) {
  if (localTags.value.includes(tag)) {
    localTags.value = localTags.value.filter((t) => t !== tag)
  } else {
    localTags.value.push(tag)
  }
}

function saveTags() {
  isEditingTags.value = false

  if (JSON.stringify(localTags.value) !== JSON.stringify(props.song.tags)) {
    emit('statusUpdated', <Song>{
      id: props.song.id,
      tags: localTags.value.sort(),
    })
  }

  emit('editingFinished', props.song.id)
}

function arraysEquals(a: string[], b: string[]) {
  return a.length === b.length && [...a].sort().every((val, i) => val === [...b].sort()[i])
}
</script>

<template>
  <BaseCard clickable @click="$emit('selectsong', song.id)">
    <!-- body -->
    <div class="text-lg font-bold text-gray-900 leading-tight">
      {{ song.title }}
    </div>

    <div class="text-sm text-gray-600 mt-0.5">
      {{ song.artist }}
    </div>

    <StatusBadge
      :model-value="song.status"
      :statuses="allStatuses"
      :labels="statusLabels"
      :classes="statusClasses"
      @update:modelValue="onUpdateSongStatus"
    />

    <!-- tags -->
    <div class="mt-3">
      <!-- Visual normal -->
      <div
        v-if="!isEditingTags"
        class="flex flex-wrap gap-2 cursor-pointer"
        @click.stop="isEditingTags = true"
      >
        <template v-if="song.tags?.length">
          <span v-for="tag in song.tags" :key="tag" class="text-xs px-2 py-1 bg-gray-100 rounded">
            {{ tag }}
          </span>
        </template>

        <span v-else class="text-xs text-gray-400 italic"> + adicionar tag </span>
      </div>

      <!-- Modo edição -->
      <div v-else class="space-y-2">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in availableTags"
            :key="tag"
            @click.stop="toggleTag(tag)"
            :class="[
              'text-xs px-2 py-1 rounded border',
              localTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-100',
            ]"
          >
            {{ tag }}
          </button>
        </div>

        <button @click.stop="saveTags" class="text-xs text-blue-600 hover:underline">Pronto</button>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <span v-if="song.releaseYear">📅 {{ song.releaseYear }}</span>
        <span v-if="song.tags?.length">🏷 {{ song.tags.length }} tags</span>
      </div>
    </template>
  </BaseCard>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
