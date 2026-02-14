<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSongApi } from '@/composables/useSongApi.ts'
import type { Song } from '@/types/song.ts'
import SongCardGrid from '@/components/song/SongCardGrid.vue'
import SongSidePanel from '@/components/song/SongSidePanel.vue'
import SidePanel from '@/components/ui/SidePanel.vue'

const { songList, loadSongList, createSong, updateSong, loading, error, deleteSong } = useSongApi()

const selectedId = ref<string | null>(null)
const isPanelOpen = ref(false)
const selectedSong = computed(() => songList.value.find((s) => s.id === selectedId.value))


const formSong = ref(null)

onMounted(() => {
  loadSongList()
})
function openPanel() {
  isPanelOpen.value = true
}
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

async function onFormSaved() {
  try {
    if (!formSong.value) {
      // nada a fazer (proteção)
      isPanelOpen.value = false
      return
    }

    const payload = formSong.value as Song

    if (payload.id) {
      await updateSong(payload.id, payload)
    } else {
      await createSong(payload)
    }

    await loadSongList() // refresh
  } catch (err) {
    console.error('Erro ao salvar música:', err)
    // opcional: mostrar toast/banner de erro
  } finally {
    isPanelOpen.value = false
    formSong.value = null
  }
}

function closeForm() {
  isPanelOpen.value = false
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
          Views
        </button>
        <button class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Likes
        </button>
        <button class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Comments
        </button>
        <button class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Avg / Day
        </button>
      </div>

      <input
        type="text"
        placeholder="Filter songs..."
        class="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
    </div>

    <SongCardGrid
      :songList="songList"
      @selectSong="selectSong"
    />

    <SongSidePanel v-if="selectedSong"  :show="isPanelOpen" :song="selectedSong" @close="closePanel" />

  </div>
</template>
