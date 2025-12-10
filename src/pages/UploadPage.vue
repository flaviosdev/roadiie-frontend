<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import UploadForm from '@/components/upload/UploadForm.vue'
import { useUploadApi } from '@/composables/useUploadApi'
import type { Upload } from '@/types/upload'
import UploadCardGrid from '@/components/upload/UploadCardGrid.vue'
import UploadEditPanel from '@/components/upload/UploadEditPanel.vue'

const {
  uploadList,
  loadUploadList,
  createUpload,
  updateUpload,
  loading,
  error,
  deleteUpload,
  removeLocal,
} = useUploadApi()

const selectedId = ref<string | null>(null)
const isFormOpen = ref(false)
const formUpload = ref<Upload | null>(null)

onMounted(() => {
  loadUploadList()
})

const selectedUpload = computed(
  () => uploadList.value.find((u) => u.id === selectedId.value) ?? null,
)

function selectUpload(id: string) {
  const upload = uploadList.value.find(u => u.id === id)
  if (!upload) return

  formUpload.value = { ...upload }
  isFormOpen.value = true
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

function onConnect() {
  console.log('Connect')
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
  <UploadCardGrid :uploadList="uploadList" @select="selectUpload" />
  <UploadEditPanel :show="isFormOpen" @close="closeForm">
    <UploadForm
      v-if="isFormOpen"
      v-model="formUpload"
      @saved="onFormSaved"
      @cancelled="closeForm"
    />
  </UploadEditPanel>
</template>
