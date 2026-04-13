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
import Pagination from '@/components/ui/Pagination.vue'
import { useToast } from '@/composables/useToast.ts'
import { useSetlistApi } from '@/composables/useSetlistApi.ts'
import type { Setlist } from '@/types/setlist.ts'

const toast = useToast()
const { page, loadItems, createItem, updateItem, rehearseItem, deleteItem } = useSetlistItemApi()
const { page: setlistPage, loadSetlists, getSetlistById } = useSetlistApi()
const route = useRoute()

const setlistId = computed(() => route.params.setlistId as string)

const setlist = ref<Setlist | null>(null)

const items = computed<SetlistItem[]>(() => page.value?.content ?? [])

const selectedListitemId = ref<string | null>(null)
const isFormOpen = ref(false)

const selectedListitem = computed(() => items.value.find((s) => s.id === selectedListitemId.value))

const currentPage = computed(() => page.value?.number ?? 0)
const totalPages = computed(() => page.value?.totalPages ?? 0)

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

function onPageChange(page: number) {
  pageNumber.value = page
}

async function fetchItems() {
  console.log(setlistId)
  await loadItems(setlistId.value, {
    page: pageNumber.value,
    sort: sort.value,
    query: query.value || undefined,
    status: statusFilter.value === 'ALL' ? undefined : statusFilter.value,
  })
}

async function fetchSetlist() {
  if (!setlistId.value) return
  setlist.value = await getSetlistById(setlistId.value)
}

watch(setlistId, fetchSetlist)

onMounted(() => {
  fetchItems()
  fetchSetlist()
  loadSetlists()
})

watch([pageNumber, query, statusFilter, sort], fetchItems)

watch([query, statusFilter, sort], () => {
  pageNumber.value = 0
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
    setlistId: setlistId.value,
  } as SetlistItem

  createItem(setlistId.value, setlistItem).then(() => {
    toast.success(`Set list item ${setlistItem.title} created successfully.`)
    fetchItems()
  })
}

async function onUpdateSetlistItem(value: SetlistItem) {
  if (!value.id) return
  updateItem(value.setlistId, value.id, value).then(() => {
    toast.success(`Set list item ${value.title} was updated`)
    fetchItems()
    closeForm()
  })
}

async function onRehearsedSetlistItem(value: SetlistItem) {
  if (!value.id) return
  await rehearseItem(value.setlistId, value.id)
  toast.success(`Set list item ${value.title} was reheared`)
}

async function onDeleted(item: SetlistItem) {
  if (!item.id) return
  await deleteItem(item.setlistId, item.id).then(() => {
    toast.success(`Set list item ${item.title} was deleted`)
    fetchItems()
  })
}
</script>
<template>
  <AppPage :title="setlist?.title + ': items' || 'Setlist items'">
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
        @rehearsedSetlistItem="onRehearsedSetlistItem"
        @selectSetlistItem="selectSetlistItem"
      />

      <SetlistItemSidePanel
        :show="isFormOpen"
        v-if="selectedListitem"
        :setlistItem="selectedListitem"
        :setlistPage="setlistPage"
        @updated="onUpdateSetlistItem"
        @rehearsed="onRehearsedSetlistItem"
        @deleted="onDeleted"
        @close="closeForm"
      />

      <div v-if="items.length === 0">Empty list</div>
    </CardGrid>

    <Pagination
      v-if="totalPages > 1"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @change="onPageChange"
    />
  </AppPage>
</template>
