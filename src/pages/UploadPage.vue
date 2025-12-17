<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import UploadForm from '@/components/upload/UploadForm.vue'
import { useUploadApi } from '@/composables/useUploadApi'
import type { Upload } from '@/types/upload'
import UploadCardGrid from '@/components/upload/UploadCardGrid.vue'
import UploadEditPanel from '@/components/upload/UploadEditPanel.vue'
import UploadAnalysisPanel from '@/components/upload/UploadAnalysisPanel.vue'

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

function selectUpload(id: string) {
  const upload = uploadList.value.find(u => u.id === id)
  if (!upload) return

  formUpload.value = { ...upload }
  isFormOpen.value = true
}

function closeForm() {
  isFormOpen.value = false
}
</script>

<template>
  <UploadCardGrid :uploadList="uploadList" @select="selectUpload" />
  <UploadEditPanel :show="isFormOpen" @close="closeForm">
    <UploadAnalysisPanel
      v-if="isFormOpen && formUpload"
      :upload="formUpload"
    />
  </UploadEditPanel>
</template>
