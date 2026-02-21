<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useUploadMetricsApi } from '@/composables/useUploadMetricsApi.ts'
import { useMetricApi } from '@/composables/useMetricApi.ts'
import type { Upload } from '@/types/upload.ts'
import TimelineChart from '@/components/upload/tabs/timeline/TimelineChart.vue'

const props = defineProps<{ upload: Upload }>()

const { snapshots, loading, error, loadSnapshots, reset } = useUploadMetricsApi(props.upload.id)

const {
  metrics: viewsPerDayMetrics,
  errorMetrics: viewsPerDayErrorMetrics,
  loadMetrics: viewsPerDayLoadMetrics,
  resetMetrics: viewsPerDayResetMetrics,
} = useMetricApi(props.upload.id, 'VIEWS_PER_DAY_METRIC')

const {
  metrics: growthMetrics,
  errorMetrics: growthErrorMetrics,
  loadMetrics: growthLoadMetrics,
  resetMetrics: growthResetMetrics,
} = useMetricApi(props.upload.id, 'GROWTH_METRIC')

const labels = computed(() => snapshots.value.map((s) => s.date))
const growthMetricLabels = computed(() => growthMetrics.value.map((s) => s.date))

onMounted(() => {
  loadSnapshots()
  growthLoadMetrics()
  viewsPerDayLoadMetrics()
})

onUnmounted(() => {
  reset()
  growthResetMetrics()
  viewsPerDayResetMetrics()
})

const viewsChart = computed(() => [
  {
    label: 'Views',
    data: snapshots.value.map((s) => s.views),
    borderColor: '#2563eb', // blue
    backgroundColor: 'rgba(37, 99, 235, .15)',
    tension: 0.3,
  },
  {
    label: 'Views per day',
    data: viewsPerDayMetrics.value.map((s) => Math.round(s.value)),
    borderColor: '#7c3aed', // purple
    backgroundColor: 'rgba(124, 58, 237, .15)',
    tension: 0.3,
    borderDash: [6, 4], // visually differentiate derivative metric
  },
  {
    label: 'Likes',
    data: snapshots.value.map((s) => s.likes),
    borderColor: '#16a34a', // green
    backgroundColor: 'rgba(22, 163, 74, .15)',
    tension: 0.3,
  },
  {
    label: 'Comments',
    data: snapshots.value.map((s) => s.comments),
    borderColor: '#ea580c', // orange
    backgroundColor: 'rgba(234, 88, 12, .15)',
    tension: 0.3,
  },
])

const engagementChart = computed(() => [])
</script>

<template>
  <div class="space-y-10">
    <section>
      <h3 class="mb-2 text-sm font-medium text-gray-600">Views over time</h3>
      <TimelineChart :labels="labels" :datasets="viewsChart" />
    </section>
  </div>
</template>
