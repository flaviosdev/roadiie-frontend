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
const sortAscending = ref(false)

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

function sortByDate() {
  sortAscending.value = !sortAscending.value
  uploadList.value.sort((a, b) => {
    if (sortAscending.value) {
      return new Date(a.uploadedAt) - new Date(b.uploadedAt)
    } else {
      return new Date(b.uploadedAt) - new Date(a.uploadedAt)
    }
  })
}

function sortByViews() {
  sortAscending.value = !sortAscending.value
  uploadList.value.sort((a, b) => {
    if (sortAscending.value) {
      return a.summary.totalViews - b.summary.totalViews
    } else {
      return b.summary.totalViews - a.summary.totalViews
    }
  })
}

function sortByLikes() {
  sortAscending.value = !sortAscending.value
  uploadList.value.sort((a, b) => {
    if (sortAscending.value) {
      return a.summary.totalLikes - b.summary.totalLikes
    } else {
      return b.summary.totalLikes - a.summary.totalLikes
    }
  })
}function sortByComments() {
  sortAscending.value = !sortAscending.value
  uploadList.value.sort((a, b) => {
    if (sortAscending.value) {
      return a.summary.totalComments - b.summary.totalComments
    } else {
      return b.summary.totalComments - a.summary.totalComments
    }
  })
}


</script>

<template>
  <div>
    Ordenar por:
    <span v-on:click="sortByDate">Data</span> |
    <span v-on:click="sortByViews">Mais vistos</span> |
    <span v-on:click="sortByLikes">Mais curtidos</span> |
    <span v-on:click="sortByComments">Mais comentados</span> |
  </div>
  <UploadCardGrid :uploadList="uploadList" @select="selectUpload" />
  <UploadEditPanel :show="isFormOpen" @close="closeForm">
    <UploadAnalysisPanel
      v-if="isFormOpen && formUpload"
      :upload="formUpload"
    />
  </UploadEditPanel>
</template>
