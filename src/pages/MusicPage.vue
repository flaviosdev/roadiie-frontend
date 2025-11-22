<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { musicService } from '@/services/musicService.ts'
import type { Music } from '@/types/music.ts'

const music = ref<Music[]>([])
const loading = ref(true)

onMounted(async () => {
  music.value = await musicService.listAll()
  loading.value = false
})
</script>

<template>
  <div>
    <h1>Music</h1>
    <div v-if="loading">Loading...</div>

    <ul v-else>
      <li v-for="m in music" :key="m.id">
        {{ m.title }} - {{ m.artist }}
      </li>
    </ul>
  </div>
</template>
