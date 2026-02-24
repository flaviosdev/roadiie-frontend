<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSongApi } from '@/composables/useSongApi'
import { useSongScoreApi } from '@/composables/useSongScoreApi'
import { useListFilter } from '@/composables/useListFilter'
import { useListSorting } from '@/composables/useListSorting'

interface SongWithScore {
  id: string
  title: string
  popularityScore: number
  growthScore: number
  engagementScore: number
  consistencyScore: number
  finalScore: number
}

const { songList, loadSongList } = useSongApi()

const scoreList = ref<SongWithScore[]>([])
const loading = ref(false)

onMounted(async () => {
  await loadSongList()
  await loadScores()
})

async function loadScores() {
  loading.value = true
  scoreList.value = []

  for (const song of songList.value) {
    try {
      const { score, loadScore } = useSongScoreApi(song.id)
      await loadScore()

      if (score.value) {
        scoreList.value.push({
          id: song.id!,
          title: song.title,
          popularityScore: score.value.popularityScore,
          growthScore: score.value.growthScore,
          engagementScore: score.value.engagementScore,
          consistencyScore: score.value.consistencyScore,
          finalScore: score.value.finalScore,
        })
      }
    } catch (err) {
      console.error('Erro ao carregar score da song', song.id, err)
    }
  }

  loading.value = false
}

const { query, filteredList } = useListFilter(scoreList, (song, q) =>
  song.title.toLowerCase().includes(q.toLowerCase()),
)

const comparators = {
  title: (a: SongWithScore, b: SongWithScore) =>
    a.title.localeCompare(b.title, 'pt', { sensitivity: 'base' }),

  popularityScore: (a: SongWithScore, b: SongWithScore) => b.popularityScore - a.popularityScore,

  growthScore: (a: SongWithScore, b: SongWithScore) => b.growthScore - a.growthScore,

  engagementScore: (a: SongWithScore, b: SongWithScore) => b.engagementScore - a.engagementScore,

  consistencyScore: (a: SongWithScore, b: SongWithScore) => b.consistencyScore - a.consistencyScore,

  finalScore: (a: SongWithScore, b: SongWithScore) => b.finalScore - a.finalScore,
}

const { sortedList, setSort } = useListSorting(filteredList, comparators)
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Performance Score</h1>

    <!-- filtros -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          @click="setSort('title')"
          class="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-100"
        >
          Title
        </button>
        <button
          @click="setSort('finalScore')"
          class="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-100"
        >
          Final
        </button>
        <button
          @click="setSort('popularityScore')"
          class="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-100"
        >
          Popularity
        </button>
        <button
          @click="setSort('growthScore')"
          class="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-100"
        >
          Growth
        </button>
        <button
          @click="setSort('engagementScore')"
          class="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-100"
        >
          Engagement
        </button>
        <button
          @click="setSort('consistencyScore')"
          class="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-100"
        >
          Consistency
        </button>
      </div>

      <input
        v-model="query"
        type="text"
        placeholder="Filter songs..."
        class="w-full sm:w-64 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
    </div>

    <!-- grid -->
    <div v-if="loading" class="text-gray-500">Loading scores...</div>

    <div v-else class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="song in sortedList"
        :key="song.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div class="text-lg font-bold text-gray-900">
          {{ song.title }}
        </div>

        <div class="mt-4 space-y-2 text-sm text-gray-700">
          <div>
            🏆 Final: <strong>{{ song.finalScore.toFixed(2) }}</strong>
          </div>
          <div>🔥 Popularity: {{ song.popularityScore.toFixed(2) }}</div>
          <div>📈 Growth: {{ song.growthScore.toFixed(2) }}</div>
          <div>💬 Engagement: {{ song.engagementScore.toFixed(2) }}</div>
          <div>📊 Consistency: {{ song.consistencyScore.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
