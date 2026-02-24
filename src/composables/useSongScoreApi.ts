import { ref } from 'vue'
import { http } from '@/api/http'

export interface SongPerformanceScore {
  popularityScore: number
  growthScore: number
  engagementScore: number
  consistencyScore: number
  finalScore: number
  date: string
}

export function useSongScoreApi(songId: string) {
  const score = ref<SongPerformanceScore | null>(null)
  const loadingScore = ref(false)
  const errorScore = ref<string | null>(null)

  const loadScore = async () => {
    loadingScore.value = true
    errorScore.value = null

    try {
      const { data } = await http.get(`/song/${songId}/score`)
      score.value = data
    } catch (error: any) {
      errorScore.value = error?.message ?? 'Failed to load score'
      console.error('useSongScoreApi.score error', error)
    } finally {
      loadingScore.value = false
    }
  }

  const resetScore = () => {
    score.value = null
    errorScore.value = null
    loadingScore.value = false
  }

  return {
    score,
    loadingScore,
    errorScore,
    loadScore,
    resetScore,
  }
}
