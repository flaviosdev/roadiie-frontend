import { computed, ref, type Ref } from 'vue'

export function useListSorting<T>(
  list: Ref<T[]>,
  comparators: Record<string, (a: T, b: T) => number>,
) {
  // @ts-ignore
  const sortKey = ref<string>(Object.keys(comparators)[0])
  const ascending = ref(false)

  const sortedList = computed(() => {
    const comparator = comparators[sortKey.value]

    if (!comparator) return list.value

    return [...list.value].sort((a, b) => {
      const result = comparator(a, b)
      return ascending.value ? result : -result
    })
  })

  function setSort(key: string) {
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
    sortedList,
    setSort,
  }
}
