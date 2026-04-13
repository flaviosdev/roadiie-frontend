<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useUploadMetricsApi } from '@/composables/useUploadMetricsApi.ts'
import type { Upload } from '@/types/upload.ts'
import TimelineChart from '@/components/upload/tabs/timeline/TimelineChart.vue'
import { useMetricApi } from '@/composables/useMetricApi.ts'

const props = defineProps<{ upload: Upload }>()

// snapshots (views, comments, etc)
const { snapshots, loadSnapshots, reset } = useUploadMetricsApi(props.upload.id)

// 👉 NOVO: UMA ÚNICA FONTE DE MÉTRICAS
const {
  metrics, // ← todos os metrics vêm aqui (content)
  loadMetrics,
  resetMetrics,
} = useMetricApi(props.upload.id) // ou outro composable se você separou

// labels principais
const labels = computed(() => snapshots.value.map((s) => s.date))

// 🔹 indexação por tipo (O(1) lookup depois)
const metricsByType = computed(() => {
  const map: Record<string, any[]> = {}

  for (const m of metrics.value ?? []) {
    if (!map[m.metricType]) {
      map[m.metricType] = []
    }
    map[m.metricType].push(m)
  }

  // ordena por data (importante pro gráfico não ficar zoado)
  Object.keys(map).forEach((key) => {
    map[key].sort((a, b) => a.date.localeCompare(b.date))
  })

  return map
})

// 🔹 labels baseados em uma métrica consistente
const engagementLabels = computed(
  () => metricsByType.value['CUMULATIVE_ENGAGEMENT_METRIC']?.map((s) => s.date) ?? [],
)

// 🔹 gráfico de views (snapshot)
const viewsChart = computed(() => [
  {
    label: 'Views',
    data: snapshots.value.map((s) => s.views),
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, .15)',
    tension: 0.3,
  },
])

// 🔥 gráfico dinâmico com TODAS as métricas irmãs
const engagementChart = computed(() => {
  const config = [
    {
      key: 'CUMULATIVE_ENGAGEMENT_METRIC',
      label: 'Engagement',
      color: '#16a34a',
      transform: (v: number) => v,
    },
    {
      key: 'VIEWS_PER_DAY_METRIC',
      label: 'Views per day',
      color: '#7c3aed',
      transform: (v: number) => Math.round(v),
    },
    {
      key: 'ENGAGEMENT_METRIC',
      label: 'Engagement (daily)',
      color: '#f59e0b',
      transform: (v: number) => v,
    },
  ]

  const datasets = config.map((cfg) => ({
    label: cfg.label,
    data: metricsByType.value[cfg.key]?.map((s) => cfg.transform(s.value)) ?? [],
    borderColor: cfg.color,
    backgroundColor: cfg.color + '33',
    tension: 0.3,
  }))

  // mantém comments junto (snapshot)
  datasets.push({
    label: 'Comments',
    data: snapshots.value.map((s) => s.comments),
    borderColor: '#ea580c',
    backgroundColor: 'rgba(234, 88, 12, .15)',
    tension: 0.3,
  })

  return datasets
})

onMounted(() => {
  loadSnapshots()
  loadMetrics()
})

onUnmounted(() => {
  reset()
  resetMetrics()
})
</script>

<template>
  <div class="space-y-10">
    <section>
      <h3 class="mb-2 text-sm font-medium text-gray-600">Views</h3>
      <TimelineChart :labels="labels" :datasets="viewsChart" />
    </section>
  </div>
  <div class="space-y-10">
    <section>
      <h3 class="mb-2 text-sm font-medium text-gray-600">Engagement</h3>
      <TimelineChart :labels="engagementLabels" :datasets="engagementChart" />
    </section>
  </div>
</template>
