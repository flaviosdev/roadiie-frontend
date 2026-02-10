<script setup lang="ts">
import type { Song } from '@/types/song.ts'
import { defineEmits, ref, watch } from 'vue'

const props = defineProps<{
  items: Song[]
  loading: boolean
  modelValue: Song | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Song | null): void
  (e: 'search', q: string): void
  (e: 'create', name: string): void
}>()

function onSelectSong(song: Song) {
  emit('update:modelValue', song)
  emit('search', '')
}

const query = ref('')
const syncingFromModel = ref(false)

watch(
  () => props.modelValue,
  (song) => {

    if (song) {
      query.value = song.title
      syncingFromModel.value = true
    } else {
      query.value = ''
    }
    setTimeout(() => {
      syncingFromModel.value = false
    })
  },
  { immediate: true }
)

watch(query, (val) => {
  if (syncingFromModel.value) return
  if (val.length >= 2) emit('search', val)
})
</script>

<template>
  <div>
    <input v-model="query" type="text" class="input border rounded w-full p-2" />
    <ul v-if="items.length">
      <li v-for="song in items" :key="song.id" @click="onSelectSong(song)">
        {{ song.title }}
      </li>
    </ul>
    <button v-if="query.length >= 2 && !items.length && !modelValue" @click="$emit('create', query)">
      Criar "{{ query }}"
    </button>

    <p v-if="loading">Carregando...</p>
  </div>
</template>
