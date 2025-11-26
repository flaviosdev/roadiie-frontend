<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-bold text-lg">Músicas</h2>
      <button
        class="px-2 py-1 rounded bg-blue-600 text-white"
        @click="$emit('create')"
      >
        + Nova
      </button>
    </div>

    <ul class="space-y-1">
      <li
        v-for="music in musicList"
        :key="music.id"
        class="p-2 rounded cursor-pointer hover:bg-gray-100"
        :class="{'bg-gray-200': selectedId === music.id}"
        @click="$emit('select', music.id)"
      >
        {{ music.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  musicList: any[],
  selectedId: string | null
}>()

defineEmits(['select', 'create'])
</script>
