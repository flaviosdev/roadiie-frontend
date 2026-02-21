<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUploadApi } from '@/composables/useUploadApi'
import UploadCardGrid from '@/components/upload/UploadCardGrid.vue'
import type { Upload } from '@/types/upload.ts'
import UploadSidePanel from '@/components/upload/UploadSidePanel.vue'
import { useListSorting } from '@/composables/useListSorting.ts'
import { useListFilter } from '@/composables/useListFilter.ts'

const { uploadList, loadUploadList } = useUploadApi()

const { query, filteredList } = useListFilter(uploadList, (upload, q) =>
  upload.title.toLowerCase().includes(q.toLowerCase()),
)

const selectedId = ref<string | null>(null)
const isFormOpen = ref(false)

const selectedUpload = computed(() => sortedUploads.value.find((u) => u.id === selectedId.value))

const comparators = {
  date: (a: Upload, b: Upload) =>
    new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime(),
  views: (a: Upload, b: Upload) => a.summary.totalViews - b.summary.totalViews,
  likes: (a: Upload, b: Upload) => a.summary.totalLikes - b.summary.totalLikes,
  comments: (a: Upload, b: Upload) => a.summary.totalComments - b.summary.totalComments,
  avgViews: (a: Upload, b: Upload) => a.summary.totalViewsPerDay - b.summary.totalViewsPerDay,
}

const {
  sortedList: sortedUploads,
  sortKey,
  ascending,
  setSort,
} = useListSorting(filteredList, comparators)

onMounted(() => {
  loadUploadList()
})

function closeForm() {
  isFormOpen.value = false
  selectedId.value = null
}

function selectUpload(id: string) {
  selectedId.value = id
  isFormOpen.value = true
}

function onUpdatedUpload(updatedUpload: Upload) {
  const index = uploadList.value.findIndex((u) => u.id === updatedUpload.id)
  if (index === -1) return
  uploadList.value[index] = { ...updatedUpload }
  selectedId.value = updatedUpload.id
  alert('Upload was updated')
}

const sortByDate = () => setSort('date')
const sortByViews = () => setSort('views')
const sortByLikes = () => setSort('likes')
const sortByComments = () => setSort('comments')
const sortByAverageViews = () => setSort('avgViews')
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">Uploads</h1>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          @click="sortByDate"
          class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Date
        </button>
        <button
          @click="sortByViews"
          class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Views
        </button>
        <button
          @click="sortByLikes"
          class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Likes
        </button>
        <button
          @click="sortByComments"
          class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Comments
        </button>
        <button
          @click="sortByAverageViews"
          class="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
        >
          Avg / Day
        </button>
      </div>

      <input
        v-model="query"
        type="text"
        placeholder="Filter uploads..."
        class="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
    </div>

    <UploadCardGrid :uploadList="sortedUploads" @select="selectUpload" />

    <UploadSidePanel
      :show="isFormOpen"
      :upload="selectedUpload"
      @updateUpload="onUpdatedUpload"
      @close="closeForm"
    />
  </div>
</template>
