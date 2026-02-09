<template>
  <transition name="slide-in">
    <div v-if="show" class="fixed inset-0 z-50 flex bg-black/40">
      <div class="flex-1" @click="close"></div>

      <div class="relative w-full max-w-2xl bg-white h-full shadow-xl overflow-y-auto">
              <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 class="font-semibold text-gray-700">Upload</h2>

          <button
            @click="close"
            class="text-gray-500 hover:text-gray-800 text-xl leading-none"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>
        <div class="p-6">
        <slot />
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>
<style scoped>
.slide-in-enter-active, .slide-in-leave-active {
  transition: transform 0.25s ease;
}

.slide-in-enter-from, .slide-in-leave-to {
  transform: translateX(0);
}
</style>
