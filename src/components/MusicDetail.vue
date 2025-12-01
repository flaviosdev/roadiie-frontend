<template>
  <div class="space-y-4">
    <h1 class="text-2xl fondbold"> {{ music.title }}</h1>

    <p>ID: {{ music.id }}</p>
    <p>Artista: {{ music.artist }}</p>
    <p>Ano de lançamento: {{ music.releaseYear }}</p>
    <p>Tags: {{ formatTags(music.tags) }}</p>
    <p>Status: {{ music.status }}</p>

    <button class="px-3 py-1 bg-yellow-600 text-white rounded"
    @click="$emit('edit', music)">
      Editar
    </button>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  music: any
}>()

function formatTags(tags: string[]) {
  if (!tags || !tags.length) return '[sem tags]'
  return tags.join(', ')
}
</script>
