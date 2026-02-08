import { computed, ref, type Ref } from 'vue'
import type { Upload } from '@/types/upload.ts'

export type UploadSortKey =
  | 'date'
| 'views'
| 'likes'
| 'comments'
| 'avgViews'

export function useUploadSorting(uploadList: Ref<Upload[]>) {
  const sortKey = ref<UploadSortKey>('date')
  const ascending = ref(false)

  const sortedUploads = computed(() => {
    return [...uploadList.value].sort((a, b) => {
      let result = 0

      switch (sortKey.value) {
        case 'date':
          result = new Date(a.uploadedAt).getTime() -
            new Date(b.uploadedAt).getTime()
          break
        case 'views':
          result = a.summary.totalViews - b.summary.totalViews
          break
        case 'likes':
          result = a.summary.totalLikes - b.summary.totalLikes
        case 'comments':
          result = a.summary.totalComments - b.summary.totalComments
        case 'avgViews':
          result = a.summary.totalViewsPerDay - b.summary.totalViewsPerDay
          break
      }

      return ascending.value ? result : -result
    })
  })

  function setSort(key: UploadSortKey) {
    if (sortKey.value === key) {
      ascending.value = !ascending.value
    } else {
      sortKey.value = key
      ascending.value = false
    }
  }

  return {
    sortKey,
    ascending,
    sortedUploads,
    setSort
  }
}
