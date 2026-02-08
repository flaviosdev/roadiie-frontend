<template>
  <div class="space-y-4">
    <div class="text-sm text-gray-500">Edit upload details and metadata.</div>

    <UploadForm v-model="editableUpload" @updatedUpload="onUpdatedUpload" />
  </div>
</template>
<script setup lang="ts">
import type { Upload } from '@/types/upload.ts'
import { ref, watch } from 'vue'
import UploadForm from '@/components/upload/UploadForm.vue'

const props = defineProps<{
  upload: Upload
}>()

const emit = defineEmits<{
  (e: 'updated', upload: Upload): void
}>()

const editableUpload = ref<Upload>({ ...props.upload })

watch(
  () => props.upload,
  (newUpload) => {
    editableUpload.value = { ...newUpload }
  }
)

function onUpdatedUpload(updated: Upload): void {
  emit('updated', updated)
}
</script>
