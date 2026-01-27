<template>
  <div class="space-y-10">
    <section>
      <h3 class="mb-2 text-sm font-medium text-gray-600">Views over time</h3>
      <TimelineChart :labels="labels" :datasets="viewsChart" />
    </section>

    <section>
      <h3 class="mb-2 text-sm font-medium text-gray-600">Engagement</h3>
      <TimelineChart :labels="labels" :datasets="engagementChart" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

import { useUploadMetricsApi } from '@/composables/useUploadMetricsApi.ts'
import { useScoreApi } from '@/composables/useScoreApi.ts'
import type { Upload } from '@/types/upload.ts'
import TimelineChart from '@/components/upload/tabs/timeline/TimelineChart.vue'

const props = defineProps<{ upload: Upload }>()

const { snapshots, loading, error, loadSnapshots, reset } = useUploadMetricsApi(props.upload.id)

const { scores: viewsPerDayScores, errorScores: viewsPerDayErrorScores, loadScores: viewsPerDayLoadScores, resetScores: viewsPerDayResetScores } = useScoreApi(
  props.upload.id,
  'VIEWS_PER_DAY_SCORE',
)

const { scores: growthScores, errorScores: growthErrorScores, loadScores: growthLoadScores, resetScores: growthResetScores } = useScoreApi(
  props.upload.id,
  'GROWTH_SCORE',
)

const labels = computed(() => snapshots.value.map((s) => s.date))
const growthScoreLabels = computed(() => growthScores.value.map((s) => s.date))

onMounted(() => {
  loadSnapshots()
  growthLoadScores()
  viewsPerDayLoadScores()
})

onUnmounted(() => {
  reset()
  growthResetScores()
  viewsPerDayResetScores()
})

const viewsChart = computed(() => [
  {
    label: 'Views',
    data: snapshots.value.map((s) => s.views),
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, .15)',
  },
  {
    label: 'Views per day',
    data: viewsPerDayScores.value.map((s) => { return Math.round(s.value)}),
    borderColor: 'rgb(18,172,21)',
    backgroundColor: 'rgba(22, 163, 74, .15)',
  }
])

const engagementChart = computed(() => [
  {
    label: 'Likes',
    data: snapshots.value.map((s) => s.likes),
    borderColor: '#16a34a',
    backgroundColor: 'rgba(22, 163, 74, .15)',
  },
  {
    label: 'Comments',
    data: snapshots.value.map((s) => s.comments),
    borderColor: 'rgba(234, 88, 12)',
    backgroundColor: 'rgba(22, 163, 74, .15)',
  },
])
</script>
