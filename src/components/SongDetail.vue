<template>
  <div class="space-y-4">
    <h1 class="text-2xl fondbold"> {{ song.title }}</h1>

    <p>ID: {{ song.id }}</p>
    <p>Artista: {{ song.artist }}</p>
    <p>Ano de lançamento: {{ song.releaseYear }}</p>
    <p>Tags: {{ formatTags(song.tags) }}</p>
    <p>Status: {{ song.status }}</p>

    <button class="px-3 py-1 bg-yellow-600 text-white rounded"
    @click="$emit('edit', song)">
      Editar
    </button>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  song: any
}>()

function formatTags(tags: string[]) {
  if (!tags || !tags.length) return '[sem tags]'
  return tags.join(', ')
}
</script>
