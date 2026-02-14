<script setup lang="ts">
import type { Song } from '@/types/song'
import SidePanel from '@/components/ui/SidePanel.vue'
import SongAnalysisPanel from '@/components/song/SongAnalysisPanel.vue'

defineProps<{
  show: boolean
  song: Song | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

</script>

<template>
  <SidePanel :show="show" @close="emit('close')">
    <SongAnalysisPanel :song="song" />
  </SidePanel>
</template>
