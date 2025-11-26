import type { Upload } from '@/types/upload'
import { ref } from 'vue'
import { http } from '@/api/http'

export function useUploadApi() {
  const uploadList = ref<Upload[]>([])
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

  const findUploadById = async (id: string) => {
    const { data } = await http.get<Upload>(`/upload/${id}`)
    return data
  }

  const createUpload = async (data: Upload) => http.post<Upload>('/upload', data)

  const updateUpload = async (id: string, data: Upload) => http.put<Upload>(`/upload/${id}`, data)

  const deleteUpload = (id: string) => http.delete<Upload>(`/upload/${id}`)

  const removeLocal = (id: string) => {
    uploadList.value = uploadList.value.filter((u) => u.id !== id)
  }

  return {
    uploadList,
    loading,
    error,
    loadUploadList,
    findUploadById,
    createUpload,
    updateUpload,
    deleteUpload,
    removeLocal,
  }
}
