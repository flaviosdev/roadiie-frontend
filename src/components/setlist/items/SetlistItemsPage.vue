<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSetlistItemApi } from '@/composables/useSetlistItemApi'
import type { SetlistItem } from '@/types/setlistItem'
import { allSetlistItemStatuses, setlistItemStatusLabels } from '@/types/setlistItemStatus.ts'
import AppPage from '@/components/ui/AppPage.vue'
import CardGrid from '@/components/ui/CardGrid.vue'
import CreateCard from '@/components/ui/CreateCard.vue'
import SetlistItemCard from '@/components/setlist/items/SetlistItemCard.vue'
import SetlistItemSidePanel from '@/components/setlist/items/SetlistItemSidePanel.vue'

const { page, loadItems, createItem, updateItem } = useSetlistItemApi()
const route = useRoute()

const items = computed<SetlistItem[]>(() => page.value?.content ?? [])

const selectedListitemId = ref<string | null>(null)
const isFormOpen = ref(false)

const selectedListitem = computed(() => items.value.find((s) => s.id === selectedListitemId.value))

const props = defineProps<{
  setlistId: string
}>()

const query = ref('')
const statusFilter = ref('ALL')
const sort = ref('order,asc')
const pageNumber = ref(0)

function closeForm() {
  isFormOpen.value = false
  selectedListitemId.value = null
}
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

function selectSetlistItem(id: string) {
  selectedListitemId.value = id
  isFormOpen.value = true
}

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

async function onUpdateSetlistItem(value: SetlistItem) {
  if (!value.id) return
  updateItem(value.setlistId, value.id, value).then((r) => {
    fetchItems()
  })

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
          <button
            @click="setSort('status')"
            class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Status
          </button>
          <button
            @click="setSort('lastRehearsedAt')"
            class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Ensaio
          </button>
          <button
            @click="setSort('order')"
            class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Ordem
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
        v-for="setlistItem in items"
        :key="setlistItem.id"
        :setlistItem="setlistItem"
        @updateSetlistItem="onUpdateSetlistItem"
        @selectSetlistItem="selectSetlistItem"
      />

      <SetlistItemSidePanel
        :show="isFormOpen"
        v-if="selectedListitem"
        :setlistItem="selectedListitem"
        @updated="onUpdateSetlistItem"
        @close="closeForm"
      >
      </SetlistItemSidePanel>

      <div v-if="items.length === 0">Empty list</div>
    </CardGrid>
  </AppPage>
</template>
