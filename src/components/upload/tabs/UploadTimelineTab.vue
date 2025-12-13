<template>
  <div class="w-full">
    <div v-if="error" class="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>

    <div class="relative">
      <canvas ref="canvasRef" class="w-full h-72"></canvas>

      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/60">
        <span class="text-sm text-gray-600">Loading metrics…</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js'
import { useUploadMetricsApi } from '@/composables/useUploadMetricsApi'
import type { Upload } from '@/types/upload.ts'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
)

const props = defineProps<{ upload: Upload }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const {
  snapshots,
  loading,
  error,
  loadSnapshots,
  reset
} = useUploadMetricsApi(props.upload.id)

function buildChart() {
  if (!canvasRef.value) return

  if (chart) {
    chart.destroy()
    chart = null
  }

  const labels = snapshots.value.map(s => s.day)

  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Views',
          data: snapshots.value.map(s => s.views),
          tension: 0.3
        },
        {
          label: 'Likes',
          data: snapshots.value.map(s => s.likes),
          tension: 0.3
        },
        {
          label: 'Comments',
          data: snapshots.value.map(s => s.comments),
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

onMounted(async () => {
  await loadSnapshots()
  buildChart()
})

watch(snapshots, () => {
  buildChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
  reset()
})
</script>
