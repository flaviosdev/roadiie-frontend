import { ref } from 'vue'
import { http } from '@/api/http'
import type { Page } from '@/types/page'
import type { SetlistItem } from '@/types/setlistItem.ts'

export function useSetlistItemApi() {
  const page = ref<Page<SetlistItem> | null>(null)

  type LoadParams = {
    page?: number
    size?: number
    sort?: string
    query?: string
    status?: string
  }

  const loadItems = async (setlistId: string, params: LoadParams = {}) => {
    const { page: pageNumber = 0, size = 20, sort = 'order,asc', query, status } = params

    const { data } = await http.get<Page<SetlistItem>>(`/setlist/${setlistId}/items`, {
      params: {
        page: pageNumber,
        size,
        sort,
        query,
        status,
      },
    })

    page.value = data
  }

  const createItem = async (setlistId: string, setlistItem: SetlistItem) => {
    await http.post<SetlistItem>(`/setlist/${setlistId}/items`, setlistItem)
    await loadItems(setlistId)
  }

  const updateItem = async (setlistId: string, setlistItemId: string, setlistItem: SetlistItem) => {
    await http.put<SetlistItem>(`/setlist/${setlistId}/items/${setlistItemId}`, setlistItem)
    await loadItems(setlistId)
  }

  const deleteItem = async (setlistId: string, setlistItemId: string) => {
    await http.delete<SetlistItem>(`/setlist/${setlistId}/items/${setlistItemId}`, {})
  }

  return {
    page,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
  }
}
