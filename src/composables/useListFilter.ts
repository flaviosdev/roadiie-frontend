import { computed, ref, type Ref } from 'vue'

export function useListFilter<T>(list: Ref<T[]>, predicate: (item: T, query: string) => boolean) {
  const query = ref('')

  const filteredList = computed(() => {
    if (!query.value) return list.value

    return list.value.filter((item) => predicate(item, query.value))
  })

  return {
    query,
    filteredList,
  }
}
