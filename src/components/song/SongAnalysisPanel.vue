<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Song } from '@/types/song'

import SongOverviewTab from '@/components/song/tabs/SongOverviewTab.vue'
import SongPerformanceTab from '@/components/song/tabs/SongPerformanceTab.vue'
import SongProductionTab from '@/components/song/tabs/SongProductionTab.vue'
import SongRepertoireTab from '@/components/song/tabs/SongRepertoireTab.vue'
import SongEditTab from '@/components/song/tabs/SongEditTab.vue'

const props = defineProps<{
  song: Song
}>()

const emit = defineEmits<{
  (e: 'updatedSong', value: Song): void
}>()

const localSong = reactive<Song>({ ...props.song })

watch(
  () => props.song,
  (newSong: Song) => {
    Object.assign(localSong, newSong)
  },
)

type TabKey = 'overview' | 'performance' | 'production' | 'repertoire' | 'edit'

const activeTab = ref<TabKey>('edit')
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="border-b pb-3 mb-4">
      <h2 class="text-lg font-semibold line-clamp-2">
        {{ song.title }}
      </h2>
      <div class="text-sm text-gray-500">
        {{ song.artist }} · {{ song.releaseYear }} · {{ song.genre }}
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b mb-4 overflow-x-auto">
      <button
        v-for="tab in [
          { key: 'edit', label: 'Edit' },
          { key: 'overview', label: 'Overview' },
          { key: 'performance', label: 'Performance' },
          { key: 'production', label: 'Production' },
          { key: 'repertoire', label: 'Repertoire' },
        ]"
        :key="tab.key"
        @click="activeTab = tab.key as TabKey"
        class="px-3 py-1.5 text-sm rounded-t whitespace-nowrap"
        :class="
          activeTab === tab.key
            ? 'bg-white border border-b-0 font-medium'
            : 'text-gray-500 hover:text-gray-700'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <SongOverviewTab v-if="activeTab === 'overview'" :song="localSong" />
      <SongPerformanceTab v-if="activeTab === 'performance'" :song="localSong" />
      <SongProductionTab v-if="activeTab === 'production'" :song="localSong" />
      <SongRepertoireTab v-if="activeTab === 'repertoire'" :song="localSong" />

      <SongEditTab
        v-if="activeTab === 'edit'"
        :song="localSong"
        @updatedSong="emit('updatedSong', $event)"
      />
    </div>
  </div>
</template>
