<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUploadApi } from '@/composables/useUploadApi'
import UploadForm from '@/components/UploadForm.vue'
import type { Upload } from '@/types/upload.ts'

const { findAll, deletee } = useUploadApi()

const list = ref<Upload[]>([])
const showForm = ref(false)
const selectedUpload = ref<Upload | null>(null)

const load = async () => {
  const { data } = await findAll()
  list.value = data
}

const createNew = () => {
  //editId.value = null
  showForm.value = true
}

const edit = (upload: Upload) => {
  selectedUpload.value = upload
  showForm.value = true
}

const deleteUpload = async (id: string) => {
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
    <h1>Upload</h1>

    <!-- CREATE BUTTON -->
    <button @click="createNew">New Upload</button>

    <!-- LIST -->
    <ul>
      <li v-for="u in list" :key="u.id">
        {{ u.title }} - {{ u.uploadUrl }} <button @click="edit(u)">Edit</button> /
        <button @click="deleteUpload(u.id!)">Delete</button> /
      </li>
    </ul>

    <!-- FORM -->
    <UploadForm v-if="showForm" :model-value="selectedUpload" @saved="onSaved" @cancelled="closeForm" />
  </div>
</template>
