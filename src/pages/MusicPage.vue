<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import MusicList from '@/components/MusicList.vue'
import MusicDetail from '@/components/MusicDetail.vue'
import MusicForm from '@/components/MusicForm.vue'
import { useMusicApi } from '@/composables/useMusicApi.ts'
import type { Music } from '@/types/music.ts'

const { musicList, loadMusicList, createMusic, updateMusic, loading, error, deleteMusic, removeLocal } = useMusicApi()

const selectedId = ref<string | null>(null)
const isFormOpen = ref(false)
const formMusic = ref<Music | null>(null)

onMounted(() => {
  loadMusicList()
})

const selectedMusic = computed(() => musicList.value.find(music => music.id === selectedId.value) ?? null)

function selectMusic(id: string) {
  selectedId.value = id
  isFormOpen.value = false
}

function onCreateMusic() {
  formMusic.value = null
  isFormOpen.value = true
}

function editMusic(music: Music) {
  formMusic.value = { ...music }
  isFormOpen.value = true
}

async function handleDelete(musicId: string) {
  try {
    await deleteMusic(musicId)
    removeLocal(musicId)
  } catch (err) {
    console.error(err)
  }
}

async function onFormSaved() {
  try {
    if (!formMusic.value) {
      // nada a fazer (proteção)
      isFormOpen.value = false
      return
    }

    const payload = formMusic.value as Music

    if (payload.id) {
      await updateMusic(payload.id, payload)
    } else {
      await createMusic(payload)
    }

    await loadMusicList()   // refresh
  } catch (err) {
    console.error('Erro ao salvar música:', err)
    // opcional: mostrar toast/banner de erro
  } finally {
    isFormOpen.value = false
    formMusic.value = null
  }
}

function closeForm() {
  isFormOpen.value = false
}
</script>

<template>
  <SidebarLayout>
    <template #sidebar>
      <MusicList
        :musicList="musicList"
        :selectedId="selectedId"
        @select="selectMusic"
        @create="onCreateMusic"
      />
    </template>

    <div class="p-6">
      <div v-if="loading">Loading...</div>
      <div v-if="error" class="text-red-600">{{ error }}</div>

      <!-- Detail area -->
      <MusicDetail
        v-if="selectedMusic && !isFormOpen"
        :music="selectedMusic"
        @edit="editMusic"
        @delete="handleDelete"
      />

      <!-- Form area (create OR edit) -->
      <MusicForm
        v-if="isFormOpen"
        v-model="formMusic"
        @saved="onFormSaved"
        @cancelled="closeForm"
      />



      <!-- When neither detail nor form is open -->
      <div v-if="!selectedMusic && !isFormOpen" class="text-gray-600">
        Selecione uma música ou crie uma nova.
      </div>
    </div>
  </SidebarLayout>
</template>
