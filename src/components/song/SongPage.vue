<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSongApi } from '@/composables/useSongApi.ts'
import type { Song } from '@/types/song.ts'
import SongCardGrid from '@/components/song/SongCardGrid.vue'
import SongSidePanel from '@/components/song/SongSidePanel.vue'
import { useListFilter } from '@/composables/useListFilter.ts'
import { useListSorting } from '@/composables/useListSorting.ts'

const { songList, loadSongList, createSong, updateSong, patchSong, loading, error, deleteSong } =
  useSongApi()

const { query, filteredList } = useListFilter(songList, (search, q) =>
  search.title.toLowerCase().includes(q.toLowerCase())
)

const selectedId = ref<string | null>(null)
const isPanelOpen = ref(false)
const selectedSong = computed(() => songList.value.find((s) => s.id === selectedId.value))

const comparators = {

  title: (a: Song, b: Song) => a.title.localeCompare(b.title),

  releaseYear: (a: Song, b: Song) => a.releaseYear - b.releaseYear,

  status: (a: Song, b: Song) => a.status.localeCompare(b.status),
}

const {
  sortedList: sortedSongs,
  sortKey,
  setSort
} = useListSorting(filteredList, comparators)

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

async function onPatchedSong(patchedSong: Song) {
  if (!patchedSong.id) return
  const index = songList.value.findIndex((s) => s.id === patchedSong.id)

  const returnedSong = await patchSong(patchedSong.id, patchedSong)

  if (index === -1) return

  songList.value[index] = returnedSong
  alert('Song patched!')
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
        <button @click="setSort('title')" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Title
        </button>
        <button @click="setSort('releaseYear')" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Release Year
        </button>
        <button @click="setSort('status')" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Status
        </button>
      </div>

      <input
        type="text"
        v-model="query"
        placeholder="Filter songs..."
        class="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
    </div>

    <SongCardGrid
      :songList="sortedSongs"
      @selectSong="selectSong"
      @statusUpdated="onPatchedSong"
      @songCreated="onSongCreated"
    />

    <SongSidePanel
      v-if="selectedSong"
      :show="isPanelOpen"
      :song="selectedSong"
      @close="closePanel"
      @updatedSong="onPatchedSong"
    />
  </div>
</template>
