import { ref } from 'vue'
import { http } from '@/api/http'
import type { SongScore } from '@/types/songScore.ts'



const scoreList = ref<SongScore[] | null>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useSongScoreApi() {

  const loadScores = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await http.get(`/score`)
      scoreList.value = data.content
    } catch (error: any) {
      error.value = error?.message ?? 'Failed to load score'
      console.error('useSongScoreApi.score error', error)
    } finally {
      loading.value = false
    }
  }

  const resetScore = () => {
    scoreList.value = null
    error.value = null
    loading.value = false
  }

  return {
    scoreList,
    loading,
    error,
    loadScore: loadScores,
    resetScore,
  }
}
