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
  Legend,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
)

type Dataset = {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
}

const props = defineProps<{
  labels: string[]
  datasets: Dataset[]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

function renderChart() {
  if (!canvasRef.value) return

  if (chart) chart.destroy()

  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: props.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: {
          ticks: {
            stepSize: 1,
          },
          beginAtZero: true,
        },
      },
    },
  })
}

onMounted(renderChart)
watch(() => props.datasets, renderChart, { deep: true })

onUnmounted(() => {
  chart?.destroy()
})
</script>

<template>
  <div class="relative h-72">
    <canvas ref="canvasRef" />
  </div>
</template>
