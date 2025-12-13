import { ref } from 'vue'
import { http } from '@/api/http'

export function useUploadMetricsApi(uploadId: string) {
  const snapshots = ref<any[]>([])
  const computed = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadSnapshots = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await http.get(
        `/upload/${uploadId}/metrics/snapshots`
      )
      snapshots.value = data
    } catch (err: any) {
      error.value =
        err?.message ?? 'Failed to fetch snapshot metrics'
      console.error('useUploadMetricsApi.snapshots error', err)
    } finally {
      loading.value = false
    }
  }

  const loadComputed = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await http.get(
        `/upload/${uploadId}/metrics/computed`
      )
      computed.value = data
    } catch (err: any) {
      error.value =
        err?.message ?? 'Failed to fetch computed metrics'
      console.error('useUploadMetricsApi.computed error', err)
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    snapshots.value = []
    computed.value = []
    error.value = null
    loading.value = false
  }

  return {
    snapshots,
    computed,
    loading,
    error,
    loadSnapshots,
    loadComputed,
    reset,
  }
}
