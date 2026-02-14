<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-150"
    @click="$emit('selectSong', song.id)"
  >
    <!-- título grande -->
    <div class="text-lg font-bold text-gray-900 leading-tight">
      {{ song.title }}
    </div>

    <!-- artista -->
    <div class="text-sm text-gray-600 mt-0.5">
      {{ song.artist }}
    </div>

    <!-- status -->
    <div class="mt-2">
      <span
        class="px-2 py-0.5 rounded-lg text-white text-xs font-medium"
        :class="statusColor"
      >
        {{ song.status }}
      </span>
    </div>

    <!-- infos rápidas -->
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-3">
      <span v-if="song.releaseYear">📅 {{ song.releaseYear }}</span>
      <span v-if="song.genre">🎵 {{ song.genre }}</span>
      <span v-if="song.tags?.length">🏷 {{ song.tags.length }} tags</span>
      <span v-if="song.lyrics">📝 letra</span>
      <span v-if="song.history">📚 história</span>
    </div>

    <!-- preview de letra (opcional visual) -->
    <div
      v-if="song.lyrics"
      class="text-xs text-gray-400 mt-3 line-clamp-2 italic"
    >
      {{ song.lyrics }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Song } from '@/types/Song'
import { computed } from 'vue'

const props = defineProps<{ song: Song }>()

const statusColor = computed(() => {
  switch (props.song.status?.toLowerCase()) {
    case 'estudando':
    case 'learning':
      return 'bg-yellow-500'

    case 'pronto':
    case 'ready':
      return 'bg-green-600'

    case 'gravado':
    case 'recorded':
      return 'bg-purple-600'

    default:
      return 'bg-gray-500'
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
