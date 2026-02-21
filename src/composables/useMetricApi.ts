import { ref } from 'vue'
import { http } from '@/api/http'
import type { Metric } from '@/types/metric.ts'

export function useMetricApi(uploadId: string, metricId: string) {
  const metrics = ref<Metric[]>([])
  const loadingMetrics = ref(false)
  const errorMetrics = ref<string | null>(null)

  const loadMetrics = async () => {
    loadingMetrics.value = true
    errorMetrics.value = null

    try {
      const { data } = await http.get(
        `/upload/${uploadId}/metrics/${metricId}?page=0&size=14`
      )
      metrics.value = data.content
    } catch (error: any) {
      error.value = error?.message ?? 'Failed to load metrics'
      console.error('useMetricApi.metrics error', error)
    } finally {
      loadingMetrics.value = false
    }
  }

  const resetMetrics = () => {
    metrics.value = []
    errorMetrics.value = null
    loadingMetrics.value = false
  }

  return {
    metrics,
    loadingMetrics,
    errorMetrics,
    loadMetrics,
    resetMetrics
  }
}
