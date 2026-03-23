<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useListFilter } from '@/composables/useListFilter'
import { useListSorting } from '@/composables/useListSorting'
import { useSongScoreApi } from '@/composables/useSongScoreApi.ts'
import type { SongScore } from '@/types/songScore.ts'

const { scoreList, loadScore, generateScores: generateScoreList, loading } = useSongScoreApi()

onMounted(async () => {
  await loadScore()
})

async function generateScores() {
  await generateScoreList()
  await loadScore()
}

const { query, filteredList } = useListFilter(scoreList, (song, q) =>
  song.songName.toLowerCase().includes(q.toLowerCase()),
)

const comparators = {
  title: (a, b) => a.songName.localeCompare(b.songName),

  quality: (a, b) => (b.quality ?? 0) - (a.quality ?? 0),
  performance: (a, b) => (b.performance ?? 0) - (a.performance ?? 0),
  momentum: (a, b) => (b.momentum ?? 0) - (a.momentum ?? 0),
}

const { sortedList, setSort, sortKey } = useListSorting(filteredList, comparators)
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Performance Score</h1>

    <!-- filtros -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          @click="setSort('title')"
          :class="[
            'px-3 py-1.5 text-sm rounded-md border',
            sortKey === 'title' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100',
          ]"
        >
          Title
        </button>
        <button
          @click="setSort('quality')"
          :class="[
            'px-3 py-1.5 text-sm rounded-md border',
            sortKey === 'quality' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100',
          ]"
        >
          Quality
        </button>
        <button
          @click="setSort('performance')"
          :class="[
            'px-3 py-1.5 text-sm rounded-md border',
            sortKey === 'performance' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100',
          ]"
        >
          Performance
        </button>
        <button
          @click="setSort('momentum')"
          :class="[
            'px-3 py-1.5 text-sm rounded-md border',
            sortKey === 'momentum' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100',
          ]"
        >
          Momentum
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
        :key="song.songId"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div class="text-lg font-bold text-gray-900">
          {{ song.songName }}
        </div>

        <div>
          🎯 Quality:
          <strong :class="{ 'text-black font-bold': sortKey === 'quality' }">
            {{ song.quality?.toFixed(2) ?? '-' }}
          </strong>
        </div>

        <div>
          🚀 Performance:
          <strong :class="{ 'text-black font-bold': sortKey === 'performance' }">
            {{ song.performance?.toFixed(2) ?? '-' }}
          </strong>
        </div>

        <div>
          📈 Momentum:
          <strong :class="{ 'text-black font-bold': sortKey === 'momentum' }">
            {{ song.momentum?.toFixed(2) ?? '-' }}
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>
