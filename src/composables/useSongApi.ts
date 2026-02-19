import type { Song } from '@/types/song.ts'
import { ref } from 'vue'
import { http } from '@/api/http.ts'

const songList = ref<Song[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadedOnce = ref(false)
const lastLoad = ref<number | null>(null)

export function useSongApi() {

  const loadSongList = async (force = false) => {
    if (loading.value) return

    if (loadedOnce.value && !force) return

    loading.value = true
    error.value = null

    try {
      const { data } = await http.get<Song[]>('/song')
      songList.value = data
      loadedOnce.value = true
      lastLoad.value = Date.now()
    } catch (err: any) {
      console.error('useSongApi.load error: ', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const findSongById = async (id: string): Promise<Song | undefined> => {
    const local = songList.value.find((song) => song.id === id)
    if (local) return local

    const { data } = await http.get<Song>(`/song/${id}`)
    return data
  }

  const searchSong = async (q: string) => {
    if (!q || q.length < 2) return { data: [] }
    return http.get(`/song/search?q=${encodeURIComponent(q)}`)
  }

  const createSong = async (song: Song) => {
    const { data } = await http.post<Song>('/song', song)

    songList.value.push(data)
    return data
  }

  const updateSong = async (id: string, song: Song) => {
    const { data } = await http.put<Song>(`/song/${id}`, song)
    const index = songList.value.findIndex((m) => m.id === id)
    if (index !== -1) songList.value[index] = data

    return data
  }

  const patchSong = async (id: string, song: Song) => {
    const { data } = await http.patch<Song>(`/song/${id}`, song)
    const index = songList.value.findIndex((m) => m.id === id)
    if (index !== -1) songList.value[index] = data

    return data
  }

  const deleteSong = async (id: string) => {
    await http.delete<Song>(`/song/${id}`)
    songList.value = songList.value.filter((m) => m.id !== id)
  }

  const reloadSong = async () => loadSongList(true)

  return {
    songList,
    loading,
    error,
    loadedOnce,
    lastLoad,
    loadSongList,
    findSongById,
    createSong,
    updateSong,
    patchSong,
    deleteSong,
    reloadSong,
    searchSong,
  }
}
