<script setup lang="ts">
import type { Song } from '@/types/song'
import SidePanel from '@/components/ui/SidePanel.vue'
import UploadAnalysisPanel from '@/components/upload/UploadAnalysisPanel.vue'
import type { Upload } from '@/types/upload.ts'

defineProps<{
  show: boolean
  upload: Upload | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updateUpload', upload: Upload): void

}>()

</script>

<template>
  <SidePanel :show="show" @close="emit('close')">
    <UploadAnalysisPanel :upload="upload" @updated="emit('updateUpload', $event)"/>
  </SidePanel>
</template>
