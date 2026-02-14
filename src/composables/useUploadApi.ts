import type { Upload } from '@/types/upload'
import { ref } from 'vue'
import { http } from '@/api/http'

export function useUploadApi() {
  const uploadList = ref<Upload[]>([])
  const uploadsBySong = ref<Map<string, Upload[]>>(new Map())

  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadUploadList = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await http.get<Upload[]>('/upload')
      uploadList.value = data
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to fetch uploads'
      console.error('useUploadApi.load error', err)
    } finally {
      loading.value = false
    }
  }

  const getUploadsBySong = async (songId: string, force = false) => {
    if (!force && uploadsBySong.value.has(songId)) {
      return uploadsBySong.value.get(songId)
    }

    loading.value = true
    error.value = null
    try {
      const { data } = await http.get<Upload[]>(`/upload/bySong/${songId}`)

      uploadsBySong.value.set(songId, data)

      return data
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to fetch uploads by song'
      console.error('useUploadApi.getUploadsBySong error', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getCachedUploadsBySong = (songId: string) => {
    return uploadsBySong.value.get(songId) ?? []
  }

  const findUploadById = async (id: string) => {
    const { data } = await http.get<Upload>(`/upload/${id}`)
    return data
  }

  const createUpload = async (data: Upload) => http.post<Upload>('/upload', data)

  const updateUpload = async (id: string, data: Upload) => {
    const { data: updated } = await http.put<Upload>(`/upload/${id}`, data)

    uploadList.value = uploadList.value.map((u) => {
      return u.id === id? updated : u
      }
    )

    return updated
  }

  const deleteUpload = (id: string) => http.delete<Upload>(`/upload/${id}`)

  const removeLocal = (id: string) => {
    uploadList.value = uploadList.value.filter((u) => u.id !== id)
  }

  return {
    uploadList,
    loading,
    error,
    loadUploadList,
    getUploadsBySong,
    findUploadById,
    createUpload,
    updateUpload,
    deleteUpload,
    removeLocal,
  }
}
