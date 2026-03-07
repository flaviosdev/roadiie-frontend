<script setup lang="ts">
import { useSetlistItemApi } from '@/composables/useSetlistItemApi.ts'

const { page, loadItems, createItem } = useSetlistItemApi()
const route = useRoute()

const props = defineProps<{
  setlistId: string
}>()

onMounted(() => {
  loadItems(props.setlistId)
})

function onSetlistItemCreated(value: string) {
  const setlistItem = <SetlistItem>{
    title: value,
    setlistId: props.setlistId,
  }
  createItem(props.setlistId, setlistItem)
}

function onSelectSetlistItem(value: string) {
  alert(value)
}

import AppPage from '@/components/ui/AppPage.vue'
import CardGrid from '@/components/ui/CardGrid.vue'
import CreateCard from '@/components/ui/CreateCard.vue'
import { useRoute } from 'vue-router'
import type { SetlistItem } from '@/types/setlistItem.ts'
import { onMounted } from 'vue'
import SetlistItemCard from '@/components/setlist/items/SetlistItemCard.vue'
</script>
<template>
  <AppPage title="Setlist Items">
    <CardGrid>
      <CreateCard
        title="Criar Música"
        subtitle="Clique para adicionar"
        placeholder="Nome do item..."
        @create="onSetlistItemCreated"
      />

      <SetlistItemCard v-for="setlistItem in page?.content ?? []"
                       :key="setlistItem.id"
                       :setlistItem="setlistItem"
                       @selectSetlistItem="onSelectSetlistItem"
      />

      <div v-if="page?.empty">
        Empty list
      </div>
    </CardGrid>
  </AppPage>
</template>
