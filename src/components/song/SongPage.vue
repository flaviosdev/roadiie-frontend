<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSongApi } from '@/composables/useSongApi.ts'
import type { Song } from '@/types/song.ts'
import SongCardGrid from '@/components/song/SongCardGrid.vue'
import SongSidePanel from '@/components/song/SongSidePanel.vue'
import SidePanel from '@/components/ui/SidePanel.vue'
import { useUploadApi } from '@/composables/useUploadApi.ts'

const { songList, loadSongList, createSong, updateSong, loading, error, deleteSong } = useSongApi()
const { getUploadsBySong } = useUploadApi()

const selectedId = ref<string | null>(null)
const isPanelOpen = ref(false)
const selectedSong = computed(() => songList.value.find((s) => s.id === selectedId.value))

const formSong = ref(null)

onMounted(() => {
  loadSongList()
})

function closePanel() {
  isPanelOpen.value = false
  selectedId.value = null
}
function selectSong(id: string) {
  selectedId.value = id
  isPanelOpen.value = true
}

function onCreateSong() {
  formSong.value = null
  isPanelOpen.value = true
}

function editSong(song: Song) {
  songList.value.push(song)
  isPanelOpen.value = true
}

async function handleDelete(songId: string) {
  try {
    await deleteSong(songId)
  } catch (err) {
    console.error(err)
  }
}

async function onUpdatedSong(updatedSong: Song) {
  try {
    if (!updatedSong.id) return
    const index = songList.value.findIndex((s) => s.id === updatedSong.id)

    await updateSong(updatedSong.id, updatedSong)

    if (index === -1) return

    songList.value[index] = { ...updatedSong }
    alert('Song updated!')
  } catch (err) {
    console.error('Error while updating song:', err)
  }
}

async function onSongCreated(title: string) {
  const newSong: Song = {
    title,
  }

  await createSong(newSong)
  alert('Pronto!')
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-800 mb4">Songs</h1>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div class="flex flex-wrap gap-2">
        <button class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Date
        </button>
        <button class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Relevance
        </button>
        <button class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Flow
        </button>
      </div>

      <input
        type="text"
        placeholder="Filter songs..."
        class="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
    </div>

    <SongCardGrid
      :songList="songList"
      @selectSong="selectSong"
      @statusUpdated="onUpdatedSong"
      @songCreated="onSongCreated"
    />

    <SongSidePanel
      v-if="selectedSong"
      :show="isPanelOpen"
      :song="selectedSong"
      @close="closePanel"
      @updatedSong="onUpdatedSong"
    />
  </div>
</template>
