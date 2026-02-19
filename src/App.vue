<script setup lang="ts">
import TopMenu from '@/components/TopMenu.vue'
import { useSongApi } from '@/composables/useSongApi.ts'
import { onMounted } from 'vue'
import { globalError } from '@/api/globalError.ts'

const { loadSongList } = useSongApi()

onMounted(() => {
  loadSongList()
})

</script>

<template>
  <div v-if="globalError" class="global-error">
    {{ globalError }}
  </div>
  <div>
    <TopMenu />
    <router-view />
  </div>
</template>

<style scoped>
  .global-error {
    color: #de4e4e
  }
</style>
