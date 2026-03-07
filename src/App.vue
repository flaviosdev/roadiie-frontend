<script setup lang="ts">
import TopMenu from '@/components/TopMenu.vue'
import { useSongApi } from '@/composables/useSongApi.ts'
import { onMounted } from 'vue'
import { globalError } from '@/api/globalError.ts'
import { useRoute } from 'vue-router'

const { loadSongList } = useSongApi()
const route = useRoute()

onMounted(() => {
  loadSongList()
})

</script>

<template>
  <div v-if="globalError" class="global-error">
    {{ globalError }}
  </div>
  <div>
    <TopMenu v-if="!route.meta.public" />
    <router-view />
  </div>
</template>

<style scoped>
  .global-error {
    color: #de4e4e
  }
</style>
