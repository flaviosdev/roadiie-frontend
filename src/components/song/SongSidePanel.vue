<script setup lang="ts">
import type { Song } from '@/types/song'
import SidePanel from '@/components/ui/SidePanel.vue'
import SongEditTab from '@/components/song/tabs/SongEditTab.vue'
import { ref, watch } from 'vue'
import SongAnalysisPanel from '@/components/song/SongAnalysisPanel.vue'

const props = defineProps<{
  show: boolean
  song: Song | null
}>()

const emit = defineEmits<{
  (e: 'updatedSong', value: Song): void
  (e: 'close'): void
}>()

const localSong = ref<Song | null>(null)

watch(
  () => props.song,
  (value) => {
    localSong.value = value ? { ...value } : null
  },
  { immediate: true },
)

function save() {
  if (!localSong.value) return
  emit('updatedSong', localSong.value)
}

function close() {
  emit('close')
}
</script>

<template>
  <SidePanel :show="show" @close="close">
    <SongAnalysisPanel v-if="song" :song="song" @updatedSong="emit('updatedSong', $event)" />
  </SidePanel>
</template>
