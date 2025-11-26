<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import UploadList from '@/components/UploadList.vue'
import UploadDetail from '@/components/UploadDetail.vue'
import UploadForm from '@/components/UploadForm.vue'
import { useUploadApi } from '@/composables/useUploadApi'
import type { Upload } from '@/types/upload'

const { uploadList, loadUploadList, createUpload, updateUpload, loading, error, deleteUpload, removeLocal } = useUploadApi()

const selectedId = ref<string | null>(null)
const isFormOpen = ref(false)
const formUpload = ref<Upload | null>(null)

onMounted(() => {
  loadUploadList()
})

const selectedUpload = computed(() => uploadList.value.find(u => u.id === selectedId.value) ?? null)

function selectUpload(id: string) {
  selectedId.value = id
  isFormOpen.value = false
}

function onCreateUpload() {
  formUpload.value = null
  isFormOpen.value = true
}

function editUpload(upload: Upload) {
  formUpload.value = { ...upload }
  isFormOpen.value = true
}

async function handleDelete(uploadId: string) {
  try {
    await deleteUpload(uploadId)
    removeLocal(uploadId)
  } catch (err) {
    console.error(err)
  }
}

async function onFormSaved() {
  try {
    if (!formUpload.value) {
      isFormOpen.value = false
      return
    }

    const payload = formUpload.value as Upload

    if (payload.id) {
      await updateUpload(payload.id, payload)
    } else {
      await createUpload(payload)
    }

    await loadUploadList()
  } catch (err) {
    console.error('Erro ao salvar upload:', err)
  } finally {
    isFormOpen.value = false
    formUpload.value = null
  }
}

function closeForm() {
  isFormOpen.value = false
}
</script>

<template>
  <SidebarLayout>
    <template #sidebar>
      <UploadList
        :uploadList="uploadList"
        :selectedId="selectedId"
        @select="selectUpload"
        @create="onCreateUpload"
      />
    </template>

    <div class="p-6">
      <div v-if="loading">Loading...</div>
      <div v-if="error" class="text-red-600">{{ error }}</div>

      <UploadDetail
        v-if="selectedUpload && !isFormOpen"
        :upload="selectedUpload"
        @edit="editUpload"
        @delete="handleDelete"
      />

      <UploadForm
        v-if="isFormOpen"
        v-model="formUpload"
        @saved="onFormSaved"
        @cancelled="closeForm"
      />

      <div v-if="!selectedUpload && !isFormOpen" class="text-gray-600">
        Selecione um upload ou crie um novo.
      </div>
    </div>
  </SidebarLayout>
</template>
