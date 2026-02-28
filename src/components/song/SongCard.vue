<script setup lang="ts">
import type { Song } from '@/types/song.ts'
import { ref, watch } from 'vue'
import { allStatuses, statusClasses, statusLabels } from '@/types/songStatus.ts'

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

const isEditingStatus = ref(false)
const localStatus = ref(props.song.status)

function saveStatus() {
  isEditingStatus.value = false

  if (localStatus.value !== props.song.status) {
    emit('statusUpdated', <Song>{
      id: props.song.id,
      status: localStatus.value,
    })
  }
  emit('editingFinished', props.song.id)
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
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-150"
    @click="$emit('selectSong', song.id)"
  >
    <!-- título grande -->
    <div class="text-lg font-bold text-gray-900 leading-tight">
      {{ song.title }}
    </div>

    <!-- artista -->
    <div class="text-sm text-gray-600 mt-0.5">
      {{ song.artist }}
    </div>

    <!-- status todo: extrair para componente-->
    <div class="mt-2">
      <!-- Badge normal -->
      <span
        v-if="!isEditingStatus"
        @click.stop="isEditingStatus = true"
        :class="[
          'inline-flex items-center px-2 py-1 text-xs font-medium rounded cursor-pointer transition',
          statusClasses[song.status],
        ]"
      >
        {{ statusLabels[song.status] }}
      </span>

      <!-- Dropdown quando clicado -->
      <select
        v-else
        v-model="localStatus"
        @blur="saveStatus"
        @change="saveStatus"
        class="text-xs border rounded px-2 py-1"
      >
        <option v-for="status in allStatuses" :key="status" :value="status">
          {{ statusLabels[status] }}
        </option>
      </select>
    </div>

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

    <!-- infos rápidas -->
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-3">
      <span v-if="song.releaseYear">📅 {{ song.releaseYear }}</span>
      <span v-if="song.tags?.length">🏷 {{ song.tags.length }} tags</span>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
