<template>
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
    <UploadCard
      v-for="upload in uploadList"
      :key="upload.id"
      :upload="upload"
      @select="$emit('select', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import UploadCard from './UploadCard.vue'
import type { Upload } from '@/types/upload.ts'

defineProps<{ uploadList: Upload[] }>()
defineEmits(['select'])
</script>
