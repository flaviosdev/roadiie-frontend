<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import SongList from '@/components/SongList.vue'
import SongDetail from '@/components/SongDetail.vue'
import SongForm from '@/components/SongForm.vue'
import { useSongApi } from '@/composables/useSongApi.ts'
import type { Song } from '@/types/song.ts'

const { songList, loadSongList, createSong, updateSong, loading, error, deleteSong } = useSongApi()

const selectedId = ref<string | null>(null)
const isFormOpen = ref(false)
const formSong = ref<Song | null>(null)

onMounted(() => {
  loadSongList()
})

const selectedSong = computed(() => songList.value.find(song => song.id === selectedId.value) ?? null)

function selectSong(id: string) {
  selectedId.value = id
  isFormOpen.value = false
}

function onCreateSong() {
  formSong.value = null
  isFormOpen.value = true
}

function editSong(song: Song) {
  formSong.value = { ...song }
  isFormOpen.value = true
}

async function handleDelete(songId: string) {
  try {
    await deleteSong(songId)
  } catch (err) {
    console.error(err)
  }
}

async function onFormSaved() {
  try {
    if (!formSong.value) {
      // nada a fazer (proteção)
      isFormOpen.value = false
      return
    }

    const payload = formSong.value as Song

    if (payload.id) {
      await updateSong(payload.id, payload)
    } else {
      await createSong(payload)
    }

    await loadSongList()   // refresh
  } catch (err) {
    console.error('Erro ao salvar música:', err)
    // opcional: mostrar toast/banner de erro
  } finally {
    isFormOpen.value = false
    formSong.value = null
  }
}

function closeForm() {
  isFormOpen.value = false
}
</script>

<template>
  <SidebarLayout>
    <template #sidebar>
      <SongList
        :songList="songList"
        :selectedId="selectedId"
        @select="selectSong"
        @create="onCreateSong"
      />
    </template>

    <div class="p-6">
      <div v-if="loading">Loading...</div>
      <div v-if="error" class="text-red-600">{{ error }}</div>

      <!-- Detail area -->
      <SongDetail
        v-if="selectedSong && !isFormOpen"
        :song="selectedSong"
        @edit="editSong"
        @delete="handleDelete"
      />

      <!-- Form area (create OR edit) -->
      <SongForm
        v-if="isFormOpen"
        v-model="formSong"
        @saved="onFormSaved"
        @cancelled="closeForm"
      />



      <!-- When neither detail nor form is open -->
      <div v-if="!selectedSong && !isFormOpen" class="text-gray-600">
        Selecione uma música ou crie uma nova.
      </div>
    </div>
  </SidebarLayout>
</template>
