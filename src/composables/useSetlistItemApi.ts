import { ref } from 'vue'
import { http } from '@/api/http'
import type { Page } from '@/types/page'
import type { SetlistItem } from '@/types/setlistItem.ts'

export function useSetlistItemApi() {
  const page = ref<Page<SetlistItem> | null>(null)

  const loadItems = async (
    setlistId: string,
    pageNumber = 0,
    pageSize = 20,
    sort = 'order,asc',
  ) => {
    const { data } = await http.get<Page<SetlistItem>>(`/setlist/${setlistId}/items`, {
      params: {
        page: pageNumber,
        size: pageSize,
        sort,
      },
    })

    page.value = data
  }

  const createItem = async (setlistId: string, setlistItem: SetlistItem) => {
    await http.post<SetlistItem>(`/setlist/${setlistId}/items`, setlistItem)
    await loadItems(setlistId)
  }

  return {
    page,
    loadItems,
    createItem,
  }
}
