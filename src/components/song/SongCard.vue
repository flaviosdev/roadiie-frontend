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
          statusClasses[song.status]
        ]"
      >
        {{ song.status }}
      </span>

      <!-- Dropdown quando clicado -->
      <select
        v-else
        v-model="localStatus"
        @blur="saveStatus"
        @change="saveStatus"
        class="text-xs border rounded px-2 py-1"
      >
        <option v-for="status in Object.keys(statusClasses)" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </div>

    <!-- infos rápidas -->
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-3">
      <span v-if="song.releaseYear">📅 {{ song.releaseYear }}</span>
      <span v-if="song.genre">🎵 {{ song.genre }}</span>
      <span v-if="song.tags?.length">🏷 {{ song.tags.length }} tags</span>
      <span v-if="song.lyrics">📝 letra</span>
      <span v-if="song.history">📚 história</span>
    </div>

    <!-- preview de letra (opcional visual) -->
    <div v-if="song.lyrics" class="text-xs text-gray-400 mt-3 line-clamp-2 italic">
      {{ song.lyrics }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Song } from '@/types/Song'
import { ref, watch } from 'vue'

const props = defineProps<{
  song: Song,
  canBeClicked: boolean,
}>()

const emit = defineEmits<{
  (e: 'statusUpdated', value: Song): void
  (e: 'selectSong', value: string): void
  (e: 'editingStarted', value: string): void
  (e: 'editingFinished', value: string): void
}>()

watch(
  () => props.song.status,
  (val) => (localStatus.value = val)
)

const statusClasses: Record<string, string> = {
  DRAFT: 'bg-gray-200 text-gray-700',
  BACKLOG: 'bg-slate-200 text-slate-700',
  IN_PROGRESS: 'bg-blue-200 text-blue-700',
  REHEARSING: 'bg-indigo-200 text-indigo-700',
  RECORDED: 'bg-orange-200 text-orange-700',
  PRODUCED: 'bg-purple-200 text-purple-700',
  READY: 'bg-teal-200 text-teal-700',
  PUBLISHED: 'bg-green-200 text-green-700',
}

const isEditingStatus = ref(false)
const localStatus = ref(props.song.status)

function setEditMode() {
  isEditingStatus.value = true
  emit('editingStarted', props.song.id)
}

function saveStatus() {
  isEditingStatus.value = false

  if (localStatus.value !== props.song.status) {
    emit('statusUpdated', {
      ...props.song,
      status: localStatus.value
    })
  }
  emit('editingFinished', props.song.id)
}

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
