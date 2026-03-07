<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <h1 v-if="title" class="text-2xl font-semibold text-gray-800 mb-6">
      {{ title }}
    </h1>

    <div v-if="$slots.toolbar" class="mb-6">
      <slot name="toolbar" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
