<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMusicApi } from '@/composables/useMusicApi'
import MusicForm from '@/components/MusicForm.vue'
import type { Music } from '@/types/music.ts'

const { findAll, deletee } = useMusicApi()

const list = ref<Music[]>([])
const showForm = ref(false)
const selectedMusic = ref<Music | null>(null)

const load = async () => {
  const { data } = await findAll()
  list.value = data
}

const createNew = () => {
  //editId.value = null
  showForm.value = true
}

const edit = (music: Music) => {
  selectedMusic.value = music
  showForm.value = true
}

const deleteMusic = async (id: string) => {
  try {
    await deletee(id)
    await load()
  } catch (error) {
    console.log(error)
  }
}

const closeForm = () => {
  showForm.value = false
}

const onSaved = async () => {
  showForm.value = false
  await load()
}

onMounted(load)
</script>

<template>
  <div>
    <h1>Music</h1>

    <!-- CREATE BUTTON -->
    <button @click="createNew">New Music</button>

    <!-- LIST -->
    <ul>
      <li v-for="m in list" :key="m.id">
        {{ m.title }} - {{ m.artist }} <button @click="edit(m)">Edit</button> /
        <button @click="deleteMusic(m.id!)">Delete</button> /
      </li>
    </ul>

    <!-- FORM -->
    <MusicForm v-if="showForm" :model-value="selectedMusic" @saved="onSaved" @cancelled="closeForm" />
  </div>
</template>
