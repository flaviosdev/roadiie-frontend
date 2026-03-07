<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const menu = [
  { label: 'Home', to: '/' },
  { label: 'Repertório', to: '/song' },
  { label: 'Setlists', to: '/setlists' },
  { label: 'Uploads', to: '/upload' },
  { label: 'Scores', to: '/score' },
]

const isActive = (path: string) => {
  return route.path.startsWith(path) && path !== '/' ? true : route.path === path
}
</script>

<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-center justify-between h-14">
        <div class="flex items-center gap-2 font-semibold text-gray-800">🎵 SongStrata</div>

        <div class="flex items-center gap-1">
          <router-link
            v-for="item in menu"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 rounded-md text-sm font-medium transition"
            :class="
              isActive(item.to)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            "
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
