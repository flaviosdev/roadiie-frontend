<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-150"
    :class="{ 'cursor-pointer hover:shadow-md hover:border-gray-300': clickable }"
    @click="handleClick"
  >
    <!-- IMAGE / HEADER -->
    <div v-if="$slots.image" class="mb-3">
      <slot name="image" />
    </div>

    <!-- META LINE -->
    <div v-if="$slots.meta" class="mb-2">
      <slot name="meta" />
    </div>

    <!-- MAIN CONTENT -->
    <div class="space-y-1">
      <slot />
    </div>

    <!-- FOOTER -->
    <div v-if="$slots.footer" class="mt-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  clickable?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  if (props.clickable) {
    emit('click')
  }
}
</script>
