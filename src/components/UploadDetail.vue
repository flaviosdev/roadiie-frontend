<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ upload.title }}</h1>

    <div>
      <img :src="`https://i.ytimg.com/vi/${upload.videoId}/default.jpg`" />
    </div>

    <p><strong>ID:</strong> {{ upload.id }}</p>
    <p><strong>Musica:</strong> {{ music?.title || upload.musicId }}</p>
    <p><strong>Título:</strong> {{ upload.title }}</p>
    <p><strong>ID da Plataforma:</strong> {{ upload.platformId }}</p>
    <p>
      <strong>Upload URL:</strong>
      <a :href="formatVideoUrl(upload.videoId)" target="_blank" class="text-blue-600 underline">{{
        upload.videoId
      }}</a>
    </p>
    <p><strong>Tags do Upload:</strong> {{ formatTags(upload.uploadTags) }}</p>
    <p><strong>Upload em:</strong> {{ formatDate(upload.uploadedAt) }}</p>

    <div class="flex gap-2">
      <button class="px-3 py-1 bg-yellow-600 text-white rounded" @click="$emit('edit', upload)">
        Editar
      </button>
      <button class="px-3 py-1 bg-red-600 text-white rounded" @click="$emit('delete', upload.id)">
        Deletar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, onMounted } from 'vue'
import type { Upload } from '@/types/upload'
import { useMusicApi } from '@/composables/useMusicApi.ts'
import type { Music } from '@/types/music.ts'

const { musicList, loadMusicList } = useMusicApi()

onMounted(() => {
  loadMusicList()
})

const music = computed<Music | null>(() => {
  return musicList.value.find((m) => m.id === props.upload.musicId) || null
})

const props = defineProps<{ upload: Upload }>()

function formatDate(d: string | Date | undefined) {
  if (!d) return '-'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString()
}

function formatTags(tags: string[]) {
  if (!tags || !tags.length) return '[sem tags]'
  return tags.join(', ')
}

function formatVideoUrl(videoId: string) {
  if (!videoId) {
    return ''
  }

  return `https://www.youtube.com/watch?v=${videoId}`
}
</script>
