<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
)

const props = defineProps<{
  labels: string[]
  datasets: {
    label: string
    data: number[]
  }[]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

function renderChart() {
  if (!canvasRef.value) return

  chart?.destroy()

  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: props.datasets.map(ds => ({
        ...ds,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.3,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: { intersect: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          ticks: { precision: 0 },
        },
      },
    },
  })
}

onMounted(renderChart)

watch(
  () => [props.labels, props.datasets],
  renderChart,
  { deep: true },
)

onUnmounted(() => {
  chart?.destroy()
  chart = null
})
</script>

<template>
  <div class="h-64">
    <canvas ref="canvasRef" />
  </div>
</template>
