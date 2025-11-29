<script setup lang="ts">
import TopMenu from '@/components/TopMenu.vue'
import { useMusicApi } from '@/composables/useMusicApi.ts'
import { onMounted } from 'vue'

const { loadMusicList } = useMusicApi()

onMounted(() => {
  loadMusicList()
})

</script>

<template>
  <div>
    <TopMenu />
    <router-view />
  </div>
</template>

<style scoped></style>
