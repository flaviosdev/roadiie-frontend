<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSetlistItemApi } from '@/composables/useSetlistItemApi'
import type { SetlistItem } from '@/types/setlistItem'
import { allSetlistItemStatuses, setlistItemStatusLabels } from '@/types/setlistItemStatus.ts'
import AppPage from '@/components/ui/AppPage.vue'
import CardGrid from '@/components/ui/CardGrid.vue'
import CreateCard from '@/components/ui/CreateCard.vue'
import SetlistItemCard from '@/components/setlist/items/SetlistItemCard.vue'

const { page, loadItems, createItem, updateItem } = useSetlistItemApi()
const route = useRoute()

const props = defineProps<{
  setlistId: string
}>()

const query = ref('')
const statusFilter = ref('ALL')
const sort = ref('order,asc')
const pageNumber = ref(0)

async function fetchItems() {
  console.log(props.setlistId)
  await loadItems(props.setlistId, {
    page: pageNumber.value,
    sort: sort.value,
    query: query.value || undefined,
    status: statusFilter.value === 'ALL' ? undefined : statusFilter.value,
  })
}

onMounted(fetchItems)

watch([query, statusFilter], () => {
  pageNumber.value = 0
  fetchItems()
})

function setSort(field: string) {
  if (sort.value.startsWith(field)) {
    sort.value = sort.value.endsWith('asc') ? `${field},desc` : `${field},asc`
  } else {
    sort.value = `${field},asc`
  }

  fetchItems()
}

function onSetlistItemCreated(value: string) {
  const setlistItem = {
    title: value,
    setlistId: props.setlistId,
  } as SetlistItem

  createItem(props.setlistId, setlistItem).then(fetchItems)
}

function onUpdateSetlistItem(value: SetlistItem) {
  if (!value.id) return
  updateItem(value.setlistId, value.id, value).then(fetchItems)
}
</script>
<template>
  <AppPage title="Setlist Items">
    <template #toolbar>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            @click="setSort('title')"
            class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Title
          </button>
        </div>

        <select v-model="statusFilter" class="px-3 py-2 text-sm rounded-md border border-gray-300">
          <option value="ALL">All</option>
          <option v-for="status in allSetlistItemStatuses" :key="status" :value="status">
            {{ setlistItemStatusLabels[status] }}
          </option>
        </select>
        <input
          type="text"
          v-model="query"
          placeholder="Filter songs..."
          class="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>
    </template>
    <CardGrid>
      <CreateCard
        title="Criar Música"
        subtitle="Clique para adicionar"
        placeholder="Nome do item..."
        @create="onSetlistItemCreated"
      />

      <SetlistItemCard
        v-for="setlistItem in page?.content ?? []"
        :key="setlistItem.id"
        :setlistItem="setlistItem"
        @updateSetlistItem="onUpdateSetlistItem"
      />

      <div v-if="page?.empty">Empty list</div>
    </CardGrid>
  </AppPage>
</template>
