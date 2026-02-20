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
import { useMetricApi } from '@/composables/useMetricApi.ts'
import type { Upload } from '@/types/upload.ts'
import TimelineChart from '@/components/upload/tabs/timeline/TimelineChart.vue'

const props = defineProps<{ upload: Upload }>()

const { snapshots, loading, error, loadSnapshots, reset } = useUploadMetricsApi(props.upload.id)

const { metrics: viewsPerDayMetrics, errorMetrics: viewsPerDayErrorMetrics, loadMetrics: viewsPerDayLoadMetrics, resetMetrics: viewsPerDayResetMetrics } = useMetricApi(
  props.upload.id,
  'VIEWS_PER_DAY_METRIC',
)

const { metrics: growthMetrics, errorMetrics: growthErrorMetrics, loadMetrics: growthLoadMetrics, resetMetrics: growthResetMetrics } = useMetricApi(
  props.upload.id,
  'GROWTH_METRIC',
)

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
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, .15)',
  },
  {
    label: 'Views per day',
    data: viewsPerDayMetrics.value.map((s) => { return Math.round(s.value)}),
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
