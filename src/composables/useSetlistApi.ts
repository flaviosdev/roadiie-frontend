import { ref } from 'vue'
import { http } from '@/api/http'
import type { Page } from '@/types/page'
import type { Setlist } from '@/types/setlist.ts'

export function useSetlistApi() {
  const page = ref<Page<Setlist> | null>(null)
  const loading = ref(false)

  const loadSetlists = async (pageNumber = 0, pageSize = 10, sort = 'createdAt,desc') => {
    loading.value = true

    try {
      const { data } = await http.get<Page<Setlist>>('/setlist', {
        params: {
          page: pageNumber,
          size: pageSize,
          sort,
        },
      })

      page.value = data
    } finally {
      loading.value = false
    }
  }

  const createSetlist = async (setlist: Setlist) => {
    await http.post<Setlist>('/setlist', setlist)
    loadSetlists()
  }

  return {
    page,
    loading,
    loadSetlists,
    createSetlist,
  }
}
