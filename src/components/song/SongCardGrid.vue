<template>
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-150"
      @click="newSong()"

    >
      <!-- título grande -->
      <div class="text-lg font-bold text-gray-900 leading-tight">
        Adicionar...
      </div>

      <!-- artista -->
      <div class="text-sm text-gray-600 mt-0.5">
        a
      </div>

    </div>

    <SongCard
      v-for="song in songList"
      :key="song.id"
      :song="song"
      @selectSong="$emit('selectSong', $event)"
      />
  </div>
</template>

<script setup lang="ts">
import SongCard from './SongCard.vue'
import type { Song } from '@/types/song.ts'

defineProps<{ songList: Song[] }>()
defineEmits(['selectSong'])

const newSong = () => {
  alert('breve')
}
</script>
