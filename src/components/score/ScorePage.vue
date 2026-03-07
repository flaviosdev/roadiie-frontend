<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useListFilter } from '@/composables/useListFilter'
import { useListSorting } from '@/composables/useListSorting'
import { useSongScoreApi } from '@/composables/useSongScoreApi.ts'
import type { SongScore } from '@/types/songScore.ts'

const { scoreList, loadScore, generateScores: generateScoreList } = useSongScoreApi()

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await loadScore()
  } finally {
    loading.value = false
  }
})

async function generateScores() {
  loading.value = true
  try {
    await generateScoreList()
    await loadScore()
  } finally {
    loading.value = false
  }
}

const { query, filteredList } = useListFilter(scoreList, (song, q) =>
  song.songName.toLowerCase().includes(q.toLowerCase()),
)

const comparators = {
  title: (a: SongScore, b: SongScore) =>
    a.songName.localeCompare(b.songName, 'pt', { sensitivity: 'base' }),

  popularityScore: (a: SongScore, b: SongScore) => b.popularityScore - a.popularityScore,

  growthScore: (a: SongScore, b: SongScore) => b.growthScore - a.growthScore,

  engagementScore: (a: SongScore, b: SongScore) => b.engagementScore - a.engagementScore,

  consistencyScore: (a: SongScore, b: SongScore) => b.consistencyScore - a.consistencyScore,

  finalScore: (a: SongScore, b: SongScore) => b.finalScore - a.finalScore,
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

      <div class="flex items-center gap-2">

        <button
          @click="generateScores"
          class="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800"
        >
          Generate
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

    <div v-else-if="!sortedList.length" class="text-center py-16">
      <p class="text-gray-500 mb-4">No scores generated yet.</p>

      <button
        @click="generateScores"
        class="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
      >
        Generate Scores
      </button>
    </div>
    <div v-else class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="song in sortedList"
        :key="song.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div class="text-lg font-bold text-gray-900">
          {{ song.songName }}
        </div>

        <div class="mt-4 space-y-2 text-sm text-gray-700">
          <div>
            🏆 Final: <strong>{{ song.finalScore?.toFixed(2) }}</strong>
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
