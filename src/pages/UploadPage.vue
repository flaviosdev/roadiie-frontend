<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUploadApi } from '@/composables/useUploadApi'
import UploadCardGrid from '@/components/upload/UploadCardGrid.vue'
import UploadEditPanel from '@/components/upload/UploadEditPanel.vue'
import UploadAnalysisPanel from '@/components/upload/UploadAnalysisPanel.vue'

const { uploadList, loadUploadList } = useUploadApi()

const selectedId = ref<string | null>(null)
const isFormOpen = ref(false)
const sortAscending = ref(false)

const selectedUpload = computed(() => uploadList.value.find((u) => u.id === selectedId.value))

onMounted(() => {
  loadUploadList()
})

function selectUpload(id: string) {
  selectedId.value = id
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
}

function sortByComments() {
  sortAscending.value = !sortAscending.value
  uploadList.value.sort((a, b) => {
    if (sortAscending.value) {
      return a.summary.totalComments - b.summary.totalComments
    } else {
      return b.summary.totalComments - a.summary.totalComments
    }
  })
}

function sortByAverageViews() {
  sortAscending.value = !sortAscending.value
  uploadList.value.sort((a, b) => {
    if (sortAscending.value) {
      return a.summary.totalViewsPerDay - b.summary.totalViewsPerDay
    } else {
      return b.summary.totalViewsPerDay - a.summary.totalViewsPerDay
    }
  })
}

function onUpdatedUpload(upload: Upload) {

}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">
      Uploads
    </h1>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div class="flex flex-wrap gap-2">
        <button @click="sortByDate" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Date
        </button>
        <button @click="sortByViews" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Views
        </button>
        <button @click="sortByLikes" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Likes
        </button>
        <button @click="sortByComments" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Comments
        </button>
        <button @click="sortByAverageViews" class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100">
          Avg / Day
        </button>
      </div>

      <input
        type="text"
        placeholder="Filter uploads..."
        class="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
    </div>

    <UploadCardGrid :uploadList="uploadList" @select="selectUpload" />
  </div>
  <UploadCardGrid :uploadList="uploadList" @select="selectUpload" />
  <UploadEditPanel :show="isFormOpen" @close="closeForm">
    <UploadAnalysisPanel v-if="isFormOpen && selectedUpload" :upload="selectedUpload" @updated="onUpdatedUpload"/>
  </UploadEditPanel>
</template>
