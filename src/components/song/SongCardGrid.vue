<template>
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-150"
    >
      <!-- MODO NORMAL -->
      <div
        v-if="!isCreating"
        class="cursor-pointer hover:shadow-md hover:border-gray-300"
        @click="isCreating = true"
      >
        <div class="text-lg font-bold text-gray-900 leading-tight">+ Criar música</div>
        <div class="text-sm text-gray-600 mt-0.5">Clique para adicionar</div>
      </div>

      <!-- MODO INPUT -->
      <div v-else>
        <input
          v-model="newTitle"
          type="text"
          placeholder="Nome da música..."
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          @keyup.enter="submit"
          @blur="cancelIfempty"
          autofocus
        />
      </div>
    </div>

    <SongCard
      v-for="song in songList"
      :key="song.id"
      :song="song"
      @statusUpdated="onStatusUpdated"
      @editingStarted="editingSongId = $event"
      @editingFinished="handleEditingFinished"
      @selectSong="onSelectSong"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SongCard from './SongCard.vue'
import type { Song } from '@/types/song.ts'

const props = defineProps<{ songList: Song[] }>()

const isCreating = ref(false)
const editingSongId = ref<string | null>(null)
const newTitle = ref('')
const selectedTag = ref<string | null>(null)

const emit = defineEmits<{
  (e: 'statusUpdated', value: Song): void
  (e: 'selectSong', value: string): void
  (e: 'songCreated', title: string): void
}>()

function submit() {
  if (!newTitle.value.trim()) return

  emit('songCreated', newTitle.value.trim())

  newTitle.value = ''
  isCreating.value = false
}

const sortedSongs = computed(() => {
  if (!selectedTag.value) return songList

  return [...songList].sort((a, b) => {
    const aHas = a.tags?.includes(selectedTag.value)
    const bHas = b.tags?.includes(selectedTag.value)

    return Number(bHas) - Number(aHas)
  })
})

const filteredSongs = computed(() => {
  if (!selectedTag.value) return props.songList

  return props.songList.filter(song => {
    song.tags?.includes(selectedTag.value!)
  })
})

function onStatusUpdated(song: Song) {
  emit('statusUpdated', song)
}

function handleEditingFinished(song: Song): void {
  editingSongId.value = null
}
function onSelectSong(songId: string): void {
  if (isCreating.value || editingSongId.value !== null) return

  editingSongId.value = null
  emit('selectSong', songId)
}

function cancelIfempty() {
  if (!newTitle.value.trim()) {
    isCreating.value = false
  }
}
</script>
