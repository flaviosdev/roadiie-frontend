<script setup lang="ts">
import type { Music } from '@/types/music.ts'
import { watch, ref, emit } from 'vue'

defineProps<{
  items: Music[]
  loading: boolean
  modelValue: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'search', q: string): void
  (e: 'create', name: string): void
}>()

const query = ref('')
watch(query, (val) => {
  if (val.length >= 2) emit('search', val)
})
</script>

<template>
  <div>
    <input v-model="query" type="text" class="input border rounded w-full p-2" />
    <ul v-if="items.length">
      <li v-for="music in items" :key="music.id" @click="$emit('update:modelValue', music.id)">
        {{ music.title }}
      </li>
    </ul>
    <button v-if="query.length >= 2 && !items.length" @click="$emit('create', query)" >
      Criar "{{ query }}"
    </button>

    <p v-if="loading">Carregando...</p>
  </div>
</template>
