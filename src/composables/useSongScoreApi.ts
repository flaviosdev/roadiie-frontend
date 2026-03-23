import { ref } from 'vue'
import { http } from '@/api/http'
import type { SongScoreView } from '@/types/songScoreView.ts'



const scoreList = ref<SongScoreView[]>([])

const loading = ref(false)
const error = ref<string | null>(null)

export function useSongScoreApi() {

  const loadScores = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await http.get(`/score`)
      scoreList.value = data
    } catch (error: any) {
      error.value = error?.message ?? 'Failed to load score'
      console.error('useSongScoreApi.score error', error)
    } finally {
      loading.value = false
    }
  }

  const generateScores = async () => {
    loading.value = true
    try {
      await http.post('/score')
    } finally {
      loading.value = false
    }
  }

  const resetScore = () => {
    scoreList.value = []
    error.value = null
    loading.value = false
  }

  return {
    scoreList,
    loading,
    error,
    generateScores,
    loadScore: loadScores,
    resetScore,
  }
}
