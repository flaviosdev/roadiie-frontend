import type { Music } from '@/types/music.ts'
import { ref } from 'vue'
import { http } from '@/api/http.ts'

const musicList = ref<Music[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadedOnce = ref(false)
const lastLoad = ref<number | null>(null)

export function useMusicApi() {

  const loadMusicList = async (force = false) => {
    if (loading.value) return

    if (loadedOnce.value && !force) return

    loading.value = true
    error.value = null

    try {
      const { data } = await http.get<Music[]>('/music')
      musicList.value = data
      loadedOnce.value = true
      lastLoad.value = Date.now()
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to fetch music'
      console.error('useMusicApí.load error', err)
    } finally {
      loading.value = false
    }
  }

  const findMusicById = async (id: string): Promise<Music | undefined> => {
    const local = musicList.value.find((music) => music.id === id)
    if (local) return local

    const { data } = await http.get<Music>(`/music/${id}`)
    return data
  }

  const searchMusic = async (q: string) => {
    if (!q || q.length < 2) return { data: []}
    return http.get(`/music/search?q=${encodeURIComponent(q)}`)
  }

  const createMusic = async (music: Music) => {
    try {
      const { data } = await http.post<Music>('/music', music)

      musicList.value.push(data)
      return data
    }catch(err) {
      console.error('Erro ao criar music', err)
      return err
    }
  }

  const updateMusic = async (id: string, music: Music) => {
    const { data } = await http.put<Music>(`/music/${id}`, music)
    const index = musicList.value.findIndex((m) => m.id === id)
    if (index !== -1) musicList.value[index] = data

    return data
  }

  const deleteMusic = async (id: string) => {
    await http.delete<Music>(`/music/${id}`)
    musicList.value = musicList.value.filter(m => m.id !== id)
  }

  const reloadMusic = async () => loadMusicList(true)

  return {
    musicList,
    loading,
    error,
    loadedOnce,
    lastLoad,
    loadMusicList,
    findMusicById,
    createMusic,
    updateMusic,
    deleteMusic,
    reloadMusic,
    searchMusic,
  }
}
