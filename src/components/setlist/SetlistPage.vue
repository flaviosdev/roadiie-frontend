<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSetlistApi } from '@/composables/useSetlistApi.ts'
import CreateCard from '@/components/ui/CreateCard.vue'
import AppPage from '@/components/ui/AppPage.vue'
import CardGrid from '@/components/ui/CardGrid.vue'
import SetlistCard from '@/components/setlist/SetlistCard.vue'
import router from '@/router'
import type { Setlist } from '@/types/setlist.ts'
import { useToast } from '@/composables/useToast.ts'

const toast = useToast()
const { page, loadSetlists, createSetlist } = useSetlistApi()

const currentPage = ref(0)
const pageSize = ref(12)
const query = ref('')
const sort = ref('createdAt,desc')

async function load() {
  await loadSetlists(currentPage.value, pageSize.value, sort.value)
}

onMounted(load)

function changePage(newPage: number) {
  currentPage.value = newPage
  load()
}

function changeSort(field: string) {
  sort.value = `${field},asc`
  load()
}

function onCreateSetlist(title: string) {
  createSetlist(<Setlist>{
    title
  })
  toast.success(`Setlist item ${title} was Created!`)
}

function onSelectSetlist(setlistId: string) {
  router.push({
    name: 'setlist',
    params: { setlistId },
  })
}
</script>
<template>
  <AppPage title="Setlists">
    <template #toolbar>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            @click="changeSort('title')"
            class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Title
          </button>
          <button
            @click="changeSort('status')"
            class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Status
          </button>
        </div>

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
        title="Criar Item"
        subtitle="Novo ensaio ou show"
        placeholder="Nome da Setlist..."
        @create="onCreateSetlist"
      />

      <SetlistCard
        v-for="setlist in page?.content ?? []"
        :key="setlist.id"
        :setlist="setlist"
        @selectSetlist="onSelectSetlist"
      />
      <div v-if="page?.empty">Empty list</div>
    </CardGrid>
  </AppPage>
</template>
