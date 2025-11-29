import type { Music } from '@/types/music.ts'
import { ref } from 'vue'
import { http } from '@/api/http.ts'

export function useMusicApi() {
  const musicList = ref<Music[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadMusicList = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await http.get<Music[]>('/music')
      musicList.value = data
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to fetch music'
      console.error('useMusicApí.load error', err)
    } finally {
      loading.value = false
    }
  }

  const findMusicById = async (id: string) => {
    const { data } = await http.get<Music>(`/music/${id}`)
    return data
  }

  const searchMusic = async (query: string) => {
    if (!query || query.length < 2) return { data: []}
    return http.get(`/music/search?q=${encodeURIComponent(query)}`)
  }

  const createMusic = async (data: Music) => http.post<Music>('/music', data)

  const updateMusic = async (id: string, data: Music) => http.put<Music>(`/music/${id}`, data)

  const deleteMusic = (id: string) => http.delete<Music>(`/music/${id}`)

  const removeLocal = (id: string) => musicList.value.filter((music) => music.id !== id)

  return {
    musicList,
    loading,
    error,
    loadMusicList,
    findMusicById,
    createMusic,
    updateMusic,
    deleteMusic,
    removeLocal,
    searchMusic,
  }
}
