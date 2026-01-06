import { ref } from 'vue'
import { http } from '@/api/http'
import type { Score } from '@/types/score.ts'

export function useScoreApi(uploadId: string, scoreId: string) {
  const scores = ref<Score[]>([])
  const loadingScores = ref(false)
  const errorScores = ref<string | null>(null)

  const loadScores = async () => {
    loadingScores.value = true
    errorScores.value = null

    try {
      const { data } = await http.get(
        `/upload/${uploadId}/scores/${scoreId}`
      )
      scores.value = data
    } catch (error: any) {
      error.value = error?.message ?? 'Failed to load scores'
      console.error('useScoreApi.scores error', error)
    } finally {
      loadingScores.value = false
    }
  }

  const resetScores = () => {
    scores.value = []
    errorScores.value = null
    loadingScores.value = false
  }

  return {
    scores,
    loadingScores,
    errorScores,
    loadScores,
    resetScores
  }
}
