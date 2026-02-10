<script setup lang="ts">
import TopMenu from '@/components/TopMenu.vue'
import { useSongApi } from '@/composables/useSongApi.ts'
import { onMounted } from 'vue'

const { loadSongList } = useSongApi()

onMounted(() => {
  loadSongList()
})

</script>

<template>
  <div>
    <TopMenu />
    <router-view />
  </div>
</template>

<style scoped></style>
