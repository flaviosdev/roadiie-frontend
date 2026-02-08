<script setup lang="ts">
import type { Music } from '@/types/music.ts'
import { defineEmits, ref, watch } from 'vue'

const props = defineProps<{
  items: Music[]
  loading: boolean
  modelValue: Music | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Music | null): void
  (e: 'search', q: string): void
  (e: 'create', name: string): void
}>()

function onSelectMusic(music: Music) {
  emit('update:modelValue', music)
  emit('search', '')
}

const query = ref('')
const syncingFromModel = ref(false)

watch(
  () => props.modelValue,
  (music) => {

    if (music) {
      query.value = music.title
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
      <li v-for="music in items" :key="music.id" @click="onSelectMusic(music)">
        {{ music.title }}
      </li>
    </ul>
    <button v-if="query.length >= 2 && !items.length && !modelValue" @click="$emit('create', query)">
      Criar "{{ query }}"
    </button>

    <p v-if="loading">Carregando...</p>
  </div>
</template>
