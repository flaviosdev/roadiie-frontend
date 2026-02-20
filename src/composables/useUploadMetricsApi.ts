import { ref } from 'vue'
import { http } from '@/api/http'
import type { UploadMetricsSnapshot } from '@/types/UploadMetricsSnapshot.ts'

export function useUploadMetricsApi(uploadId: string) {
  const snapshots = ref<UploadMetricsSnapshot[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadSnapshots = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await http.get(`/upload/${uploadId}/metrics/snapshots?page=0&size=14&sort=date,desc`)
      snapshots.value = data.reverse()
    } catch (err: any) {
      error.value =
        err?.message ?? 'Failed to fetch snapshot metrics'
      console.error('useUploadMetricsApi.snapshots error', err)
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    snapshots.value = []
    error.value = null
    loading.value = false
  }

  return {
    snapshots,
    loading,
    error,
    loadSnapshots,
    reset,
  }
}
